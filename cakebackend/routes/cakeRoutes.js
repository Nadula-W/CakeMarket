const express = require("express");
const Cake = require("../models/Cake");
const { protect, bakerOnly } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

const router = express.Router();

/* ---------------- CREATE CAKE (with image upload) ---------------- */
router.post("/", protect, bakerOnly, upload.single("image"), async (req, res) => {
  try {
    const { name, description, price, category, district, available } = req.body;

    if (!name || price === undefined || !category) {
      return res.status(400).json({ message: "Name, price, and category are required" });
    }

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : "";

    const cake = await Cake.create({
      bakerId: req.user.id,
      name,
      description: description || "",
      price: Number(price),
      category,
      district: district || "",
      imageUrl,
      available: available !== undefined ? String(available) === "true" : true,
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

/* ---------------- UPDATE CAKE (optional new image upload) ---------------- */
router.put("/:id", protect, bakerOnly, upload.single("image"), async (req, res) => {
  try {
  const cake = await Cake.findOne({ _id: req.params.id, bakerId: req.user.id });
    if (!cake) return res.status(404).json({ message: "Cake not found" });

    const { name, description, price, category, district, available } = req.body;

  // (silent) debug removed

    if (name !== undefined) cake.name = name;
    if (description !== undefined) cake.description = description;
    if (price !== undefined) cake.price = Number(price);
    if (category !== undefined) cake.category = category;
    if (district !== undefined) cake.district = district;

    if (available !== undefined) cake.available = String(available) === "true";

      // ✅ If a new file is uploaded, update imageUrl. Do NOT clear imageUrl when no file is sent.
      if (req.file) {
        cake.imageUrl = `/uploads/${req.file.filename}`;
      }

    await cake.save();
    res.json(cake);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ---------------- DELETE CAKE ✅ ---------------- */
router.delete("/:id", protect, bakerOnly, async (req, res) => {
  try {
    const cake = await Cake.findOne({ _id: req.params.id, bakerId: req.user.id });
    if (!cake) return res.status(404).json({ message: "Cake not found" });

    await cake.deleteOne();
    res.json({ message: "Cake deleted" });
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

    let sortObj = { createdAt: -1 };
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
