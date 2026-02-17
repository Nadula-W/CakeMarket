const mongoose = require("mongoose");

const OrderItemSchema = new mongoose.Schema(
  {
    cakeId: { type: mongoose.Schema.Types.ObjectId, ref: "Cake", required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    qty: { type: Number, required: true, min: 1 },
    imageUrl: { type: String, default: "" },
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    buyerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    bakerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    items: { type: [OrderItemSchema], required: true },
    subtotal: { type: Number, required: true },

    deliveryDistrict: { type: String, default: "" },
    note: { type: String, default: "" },

    buyerPhone: { type: String, default: "" },
    bakerPhone: { type: String, default: "" },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
