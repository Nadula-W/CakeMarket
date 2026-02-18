const nodemailer = require("nodemailer");

module.exports = async (email, token) => {
  try {
    const frontend = (process.env.FRONTEND_URL || "").trim().replace(/\/$/, "");

    if (!frontend) {
      throw new Error("FRONTEND_URL is missing in environment variables");
    }

    const EMAIL_USER = (process.env.EMAIL_USER || "").trim();
    const EMAIL_PASS = (process.env.EMAIL_PASS || "").trim();

    if (!EMAIL_USER || !EMAIL_PASS) {
      throw new Error("EMAIL_USER or EMAIL_PASS missing in environment variables");
    }

    const link = `${frontend}/verify-email?token=${encodeURIComponent(token)}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });

    // ✅ Verify connection before sending (helps debugging on Render)
    await transporter.verify();
    console.log("✅ SMTP connection verified");

    const info = await transporter.sendMail({
      from: `"CakeMarket" <${EMAIL_USER}>`,
      to: email,
      subject: "Verify your CakeMarket account",
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.5">
          <h3>Verify your email</h3>
          <p>Click the button below to activate your account:</p>
          <p>
            <a href="${link}" 
               style="display:inline-block;padding:10px 14px;background:#db2777;color:#fff;border-radius:8px;text-decoration:none">
              Verify Email
            </a>
          </p>
          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <p><a href="${link}">${link}</a></p>
        </div>
      `,
    });

    console.log("✅ Verification email sent:", info.response);
    console.log("🔗 Link:", link);

  } catch (err) {
    console.error("❌ EMAIL SEND ERROR:");
    console.error("Message:", err?.message);
    console.error("Code:", err?.code);
    console.error("Response:", err?.response);
    console.error("Response Code:", err?.responseCode);
    console.error("Command:", err?.command);
    console.error("Full Error:", err);

    throw err; // important so /register returns 500 properly
  }
};
