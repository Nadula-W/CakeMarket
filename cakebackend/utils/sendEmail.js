const { Resend } = require("resend");

module.exports = async (email, token) => {
  const frontend = (process.env.FRONTEND_URL || "").trim().replace(/\/$/, "");
  if (!frontend) throw new Error("FRONTEND_URL missing");

  const link = `${frontend}/verify-email?token=${encodeURIComponent(token)}`;

  const resend = new Resend(process.env.RESEND_API_KEY);
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY missing in environment variables");
  }

  await resend.emails.send({
    from: "CakeMarket <onboarding@resend.dev>",
    to: email,
    subject: "Verify your CakeMarket account",
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.5">
        <h3>Verify your email</h3>
        <p>Click to verify:</p>
        <p><a href="${link}">${link}</a></p>
      </div>
    `,
  });
};
