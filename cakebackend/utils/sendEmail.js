const nodemailer = require("nodemailer");

module.exports = async (email, token) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const link = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

  await transporter.sendMail({
    to: email,
    subject: "Verify your CakeMarket account",
    html: `
      <h3>Verify your email</h3>
      <p>Click the link below to activate your account:</p>
      <a href="${link}">${link}</a>
    `,
  });
};
