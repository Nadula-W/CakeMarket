const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,

  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    trim: true,
  },

  password: String,

  role: {
    type: String,
    enum: ["buyer", "baker", "admin"], // ✅ add admin
    default: "buyer",
  },

  bakerProfile: {
    bakeryName: String,
    district: String,
    contactNumber: String,
  },

  provider: { type: String, default: "email" },

  isVerified: { type: Boolean, default: false },
  isApproved: { type: Boolean, default: true },
  verificationToken: String,
});

module.exports = mongoose.model("User", UserSchema);
