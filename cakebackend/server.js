const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const cakeRoutes = require("./routes/cakeRoutes");
const orderRoutes = require("./routes/OrderRoutes");

const app = express();

/* ---------------- MIDDLEWARE ---------------- */
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json());

/* ---------------- STATIC ---------------- */
// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Quiet favicon
app.get("/favicon.ico", (req, res) => res.sendStatus(204));

/* ---------------- ROUTES ---------------- */
app.get("/", (req, res) => {
  res.send("CakeMarket API running");
});

app.use("/api/cakes", cakeRoutes);
app.use("/api/auth", authRoutes);

console.log("✅ Mounting admin routes at /api/admin");
app.use("/api/admin", adminRoutes);

app.use("/api/orders", orderRoutes);

/* ---------------- 404 HANDLER ---------------- */
app.use((req, res) => {
  console.error("❌ Route not found:", req.method, req.originalUrl);
  res.status(404).json({
    message: "Route not found",
    path: req.originalUrl,
  });
});

const PORT = process.env.PORT || 5000;

/* ---------------- START SERVER AFTER DB CONNECT ---------------- */
connectDB()
  .then(() => {
    const server = app.listen(PORT, () =>
      console.log(`🚀 Server running on port ${PORT}`)
    );

    server.on("error", (err) => {
      console.error("❌ Server failed to start:", err);
      if (err.code === "EADDRINUSE") {
        console.error(
          `⚠️ Port ${PORT} is already in use. Stop the process or change PORT.`
        );
      }
      process.exit(1);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect DB:", err);
    process.exit(1);
  });

/* ---------------- GLOBAL ERROR HANDLERS ---------------- */
process.on("unhandledRejection", (reason) => {
  console.error("❌ Unhandled Rejection:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
  process.exit(1);
});
