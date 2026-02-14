const express = require("express");
const Cake = require("../models/Cake");
const { protect, bakerOnly } = require("../middleware/authMiddleware");

const router = express.Router();

/* ---------------- CREATE CAKE ---------------- */
router.post("/", protect, bakerOnly, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      district,
      imageUrl,
      available,
    } = req.body;

    if (!name || price === undefined || !category) {
      return res.status(400).json({ message: "Name, price, and category are required" });
    }

    const cake = await Cake.create({
      bakerId: req.user.id,
      name,
      description: description || "",
      price,
      category,
      district: district || "",
      imageUrl: imageUrl || "",
      available: available !== undefined ? available : true,
    });

    res.status(201).json(cake);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ---------------- GET MY CAKES ---------------- */
router.get("/mine", protect, bakerOnly, async (req, res) => {
  try {
    const cakes = await Cake.find({ bakerId: req.user.id }).sort({ createdAt: -1 });
    res.json(cakes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ---------------- UPDATE CAKE ---------------- */
router.put("/:id", protect, bakerOnly, async (req, res) => {
  try {
    const cake = await Cake.findOne({ _id: req.params.id, bakerId: req.user.id });
    if (!cake) return res.status(404).json({ message: "Cake not found" });

    const {
      name,
      description,
      price,
      category,
      district,
      imageUrl,
      available,
    } = req.body;

    if (name !== undefined) cake.name = name;
    if (description !== undefined) cake.description = description;
    if (price !== undefined) cake.price = price;
    if (category !== undefined) cake.category = category;
    if (district !== undefined) cake.district = district;
    if (imageUrl !== undefined) cake.imageUrl = imageUrl;
    if (available !== undefined) cake.available = available;

    await cake.save();
    res.json(cake);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ---------------- PUBLIC BROWSE ----------------
   /api/cakes/browse?category=Wedding&district=Colombo&sort=priceAsc&q=choco
*/
router.get("/browse", async (req, res) => {
  try {
    const { category, district, sort, q, minPrice, maxPrice } = req.query;

    const filter = { available: true };

    if (category) filter.category = category;
    if (district) filter.district = district;

    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
      ];
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    let sortObj = { createdAt: -1 }; // default newest
    if (sort === "priceAsc") sortObj = { price: 1 };
    if (sort === "priceDesc") sortObj = { price: -1 };
    if (sort === "newest") sortObj = { createdAt: -1 };
    if (sort === "oldest") sortObj = { createdAt: 1 };

    const cakes = await Cake.find(filter).sort(sortObj);
    res.json(cakes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
