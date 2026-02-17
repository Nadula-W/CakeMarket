// If you don't set TWILIO env vars, it will just console.log instead of sending real SMS.

let twilioClient = null;

if (
  process.env.TWILIO_ACCOUNT_SID &&
  process.env.TWILIO_AUTH_TOKEN &&
  process.env.TWILIO_FROM_NUMBER
) {
  const twilio = require("twilio");
  twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
}

const normalizeLK = (phone) => {
  if (!phone) return "";
  const p = phone.trim();
  // Basic: accept +94xxxxxxxxx or 0xxxxxxxxx
  if (p.startsWith("+")) return p;
  if (p.startsWith("0")) return `+94${p.slice(1)}`;
  return p;
};

exports.sendSMS = async (to, message) => {
  const phone = normalizeLK(to);
  if (!phone) return;

  // Fallback if Twilio not configured
  if (!twilioClient) {
    console.log("[SMS MOCK]", phone, message);
    return;
  }

  await twilioClient.messages.create({
    from: process.env.TWILIO_FROM_NUMBER,
    to: phone,
    body: message,
  });
};
