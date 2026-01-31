const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { OAuth2Client } = require("google-auth-library");

const User = require("../models/user");
const sendEmail = require("../utils/sendEmail");

const router = express.Router();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/* ---------- EMAIL SIGNUP ---------- */
router.post("/register", async (req, res) => {
  const { name, email, password, role, bakeryName, district, contactNumber } =
    req.body;

  if (await User.findOne({ email }))
    return res.status(400).json({ message: "Email already exists" });

  const token = crypto.randomBytes(32).toString("hex");

  const user = await User.create({
    name,
    email,
    password: await bcrypt.hash(password, 10),
    role,
    bakerProfile:
      role === "baker"
        ? { bakeryName, district, contactNumber }
        : undefined,
    verificationToken: token,
    isApproved: role === "baker" ? false : true,
  });

  await sendEmail(email, token);
  res.json({ message: "Verification email sent" });
});

/* ---------- VERIFY EMAIL ---------- */
router.get("/verify-email", async (req, res) => {
  const user = await User.findOne({ verificationToken: req.query.token });
  if (!user) return res.send("Invalid token");

  user.isVerified = true;
  user.verificationToken = null;
  await user.save();

  res.redirect(`${process.env.FRONTEND_URL}/login`);
});

/* ---------- LOGIN ---------- */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  if (!user.isVerified)
    return res.status(403).json({ message: "Verify your email first" });

  if (!user.isApproved)
    return res.status(403).json({ message: "Baker approval pending" });

  if (!(await bcrypt.compare(password, user.password)))
    return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({ token, user });
});

/* ---------- GOOGLE LOGIN / SIGNUP ---------- */
router.post("/google", async (req, res) => {
  const ticket = await googleClient.verifyIdToken({
    idToken: req.body.token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const { email, name } = ticket.getPayload();
  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({
      name,
      email,
      provider: "google",
      isVerified: true,
      isApproved: true,
    });
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({ token, user });
});

module.exports = router;
