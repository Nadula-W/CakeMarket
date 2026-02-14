const nodemailer = require("nodemailer");

module.exports = async (email, token) => {
  const frontend = (process.env.FRONTEND_URL || "").replace(/\/$/, "");

  if (!frontend) {
    throw new Error("FRONTEND_URL is missing in .env");
  }

  const link = `${frontend}/verify-email?token=${encodeURIComponent(token)}`;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"CakeMarket" <${process.env.EMAIL_USER}>`,
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

  console.log("✅ Verification email sent. Link:", link);
};
