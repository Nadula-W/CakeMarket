const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { OAuth2Client } = require("google-auth-library");

const User = require("../models/user");
const sendEmail = require("../utils/sendEmail");

const router = express.Router();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// helper: clean FRONTEND_URL (prevents // issues)
const getFrontend = () => {
  const fe = (process.env.FRONTEND_URL || "").trim();
  return fe.replace(/\/$/, ""); // remove trailing slash
};

/* =========================================================
   1) EMAIL SIGNUP  (verification email is sent here ONLY)
   ========================================================= */
router.post("/register", async (req, res) => {
  try {
    let {
      name,
      email,
      password,
      role,
      bakeryName,
      district,
      contactNumber,
    } = req.body;

    email = (email || "").toLowerCase().trim();

    const existing = await User.findOne({ email });

    // ✅ If already exists but NOT verified -> resend verification (better UX)
    if (existing) {
      if (!existing.isVerified && existing.provider === "email") {
        const newToken = crypto.randomBytes(32).toString("hex");
        existing.verificationToken = newToken;
        await existing.save();
        await sendEmail(email, newToken);

        return res.status(200).json({
          message:
            "Account already exists but not verified. Verification email resent.",
        });
      }

      return res.status(400).json({ message: "Email already exists" });
    }

    const verifyToken = crypto.randomBytes(32).toString("hex");

    const newUser = await User.create({
      name,
      email,
      password: await bcrypt.hash(password, 10),
      role: role || "buyer",
      provider: "email",

      // ✅ verification ONLY at signup
      isVerified: false,
      verificationToken: verifyToken,

      // ✅ baker approval flow
      isApproved: role === "baker" ? false : true,

      bakerProfile:
        role === "baker"
          ? { bakeryName, district, contactNumber }
          : undefined,
    });

    await sendEmail(email, verifyToken);

    return res.status(201).json({
      message: "Account created. Please verify your email.",
      userId: newUser._id,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

/* =========================================================
   2) VERIFY EMAIL  (just marks user verified)
   ========================================================= */
router.get("/verify-email", async (req, res) => {
  try {
    const token = req.query.token;

    const user = await User.findOne({ verificationToken: token });
    if (!user) return res.status(400).send("Invalid token");

    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    const frontend = getFrontend();
    if (!frontend) return res.status(500).send("FRONTEND_URL missing in .env");

    // ✅ redirect safely (no //)
    return res.redirect(`${frontend}/login`);
  } catch (err) {
    return res.status(500).send("Server error");
  }
});

/* =========================================================
   3) EMAIL LOGIN  (NO verification check here)
   ========================================================= */
router.post("/login", async (req, res) => {
  try {
    let { email, password } = req.body;
    email = (email || "").toLowerCase().trim();

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // ✅ NO EMAIL VERIFICATION CHECK HERE (as you requested)

    // If user created via Google, block email login
    if (user.provider !== "email") {
      return res
        .status(400)
        .json({ message: "Use Google login for this account" });
    }

    // Baker pending approval
    if (user.role === "baker" && !user.isApproved) {
      return res.status(403).json({ message: "Baker approval pending" });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({ token, user });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

/* =========================================================
   4) GOOGLE LOGIN / SIGNUP  (NO email verification required)
      - New Google user must choose role
      - Role saved in DB
      - ✅ Link existing email-provider accounts to Google
   ========================================================= */
router.post("/google", async (req, res) => {
  try {
    const { token, role, bakeryName, district, contactNumber } = req.body;

    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = (payload.email || "").toLowerCase().trim();
    const name = payload.name;

    let user = await User.findOne({ email });

    // New user must choose role
    if (!user && !role) {
      return res.status(409).json({
        code: "ROLE_REQUIRED",
        message: "Choose buyer or baker to continue",
      });
    }

    // If they choose baker, details are mandatory
    const requireBakerDetails = (r) => {
      if (r !== "baker") return null;
      if (!bakeryName || !district || !contactNumber) {
        return "Bakery name, district and contact number are required for bakers";
      }
      return null;
    };

    // ✅ Create new Google user
    if (!user) {
      const errMsg = requireBakerDetails(role);
      if (errMsg) return res.status(400).json({ message: errMsg });

      user = await User.create({
        name,
        email,
        provider: "google",
        role,
        isVerified: true,
        isApproved: role === "baker" ? false : true,
        bakerProfile:
          role === "baker"
            ? { bakeryName, district, contactNumber }
            : undefined,
      });
    }

    // ✅ If existing user has no role and role provided now
    if (user && !user.role && role) {
      const errMsg = requireBakerDetails(role);
      if (errMsg) return res.status(400).json({ message: errMsg });

      user.role = role;
      user.isApproved = role === "baker" ? false : true;
      user.provider = "google";
      user.isVerified = true;
      user.bakerProfile =
        role === "baker"
          ? { bakeryName, district, contactNumber }
          : undefined;
      await user.save();
    }

    // ✅ If existing user is baker but missing profile, force profile update (optional but useful)
    if (user && user.role === "baker") {
      const missing =
        !user.bakerProfile?.bakeryName ||
        !user.bakerProfile?.district ||
        !user.bakerProfile?.contactNumber;

      if (missing) {
        const errMsg = requireBakerDetails("baker");
        if (errMsg) return res.status(400).json({ message: errMsg });

        user.bakerProfile = { bakeryName, district, contactNumber };
        await user.save();
      }
    }

    // Baker approval pending
    if (user.role === "baker" && !user.isApproved) {
      return res.status(403).json({ message: "Baker approval pending" });
    }

    const jwtToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({ token: jwtToken, user });
  } catch (err) {
    return res.status(500).json({ message: "Google auth failed" });
  }
});


module.exports = router;
