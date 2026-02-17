const express = require("express");
const Order = require("../models/Order");
const Cake = require("../models/Cake");
const User = require("../models/user"); // change if your file is User.js
const { protect, buyerOnly, bakerOnly } = require("../middleware/authMiddleware");
const { sendSMS } = require("../utils/sms");

const router = express.Router();

/**
 * CREATE ORDER
 * Buyer sends: { items: [{cakeId, qty}], deliveryDistrict, note, buyerPhone }
 * We will split by baker automatically (one order per baker).
 */
router.post("/", protect, buyerOnly, async (req, res) => {
  try {
    const { items, deliveryDistrict = "", note = "", buyerPhone = "" } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Load cakes
    const cakeIds = items.map((i) => i.cakeId);
    const cakes = await Cake.find({ _id: { $in: cakeIds }, available: true });

    if (cakes.length === 0) {
      return res.status(400).json({ message: "No valid cakes found" });
    }

    // Map qty by cakeId
    const qtyMap = new Map(items.map((i) => [String(i.cakeId), Number(i.qty || 1)]));

    // Group by bakerId
    const byBaker = new Map(); // bakerId -> orderItems[]
    for (const cake of cakes) {
      const qty = qtyMap.get(String(cake._id)) || 1;
      const bakerKey = String(cake.bakerId);

      const orderItem = {
        cakeId: cake._id,
        name: cake.name,
        price: cake.price,
        qty,
        imageUrl: cake.imageUrl || "",
      };

      if (!byBaker.has(bakerKey)) byBaker.set(bakerKey, []);
      byBaker.get(bakerKey).push(orderItem);
    }

    const buyer = await User.findById(req.user.id);
    const createdOrders = [];

    for (const [bakerId, orderItems] of byBaker.entries()) {
      const subtotal = orderItems.reduce((sum, it) => sum + it.price * it.qty, 0);

      const baker = await User.findById(bakerId);

      const order = await Order.create({
        buyerId: req.user.id,
        bakerId,
        items: orderItems,
        subtotal,
        deliveryDistrict,
        note,
        buyerPhone: buyerPhone || buyer?.buyerProfile?.contactNumber || "",
        bakerPhone: baker?.bakerProfile?.contactNumber || "",
      });

      createdOrders.push(order);

      // SMS to baker
      const bakerPhone = baker?.bakerProfile?.contactNumber || "";
      if (bakerPhone) {
        await sendSMS(
          bakerPhone,
          `New order received (${order._id}). Please check your dashboard to accept/reject.`
        );
      }
    }

    res.status(201).json({ message: "Order placed", orders: createdOrders });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/** BUYER: MY ORDERS */
router.get("/mine", protect, buyerOnly, async (req, res) => {
  try {
    const orders = await Order.find({ buyerId: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/** BAKER: ORDERS RECEIVED */
router.get("/baker", protect, bakerOnly, async (req, res) => {
  try {
    const orders = await Order.find({ bakerId: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/** BAKER: ACCEPT / REJECT */
router.put("/:id/status", protect, bakerOnly, async (req, res) => {
  try {
    const { status } = req.body; // "accepted" | "rejected"
    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findOne({ _id: req.params.id, bakerId: req.user.id });
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    await order.save();

    // SMS to buyer
    const buyer = await User.findById(order.buyerId);
    const buyerPhone = order.buyerPhone || buyer?.buyerProfile?.contactNumber || "";

    if (buyerPhone) {
      await sendSMS(
        buyerPhone,
        `Your order (${order._id}) was ${status} by the baker.`
      );
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
