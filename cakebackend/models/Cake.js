const mongoose = require("mongoose");

const CakeSchema = new mongoose.Schema(
  {
    bakerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    name: { type: String, required: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true },
    district: { type: String, default: "" },
    category: {
      type: String,
      enum: ["Wedding", "Birthday", "Cupcakes", "Vegan", "Gluten Free", "Macarons","Customize"],
      required: true,
    },
    imageUrl: { type: String, default: "" },
    available: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cake", CakeSchema);
