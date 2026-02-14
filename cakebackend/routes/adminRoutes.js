const express = require("express");
const User = require("../models/user");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

/* ---------------- GET PENDING BAKERS ---------------- */
router.get("/pending-bakers", protect, adminOnly, async (req, res) => {
  const bakers = await User.find({
    role: "baker",
    isApproved: false,
  }).select("-password");

  res.json(bakers);
});

/* ---------------- APPROVE BAKER ---------------- */
router.put("/approve-baker/:id", protect, adminOnly, async (req, res) => {
  const baker = await User.findById(req.params.id);

  if (!baker || baker.role !== "baker") {
    return res.status(404).json({ message: "Baker not found" });
  }

  baker.isApproved = true;
  await baker.save();

  res.json({ message: "Baker approved" });
});

/* ---------------- REJECT BAKER (OPTIONAL) ---------------- */
router.delete("/reject-baker/:id", protect, adminOnly, async (req, res) => {
  const baker = await User.findById(req.params.id);

  if (!baker || baker.role !== "baker") {
    return res.status(404).json({ message: "Baker not found" });
  }

  await baker.deleteOne();
  res.json({ message: "Baker rejected & removed" });
});

module.exports = router;
