const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");


const cakeRoutes = require("./routes/cakeRoutes");

const app = express();

// Apply CORS and JSON body parsing before mounting routes so preflight
// and other requests receive the proper headers.
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
// Ensure preflight requests are answered with proper CORS headers
app.options("*", cors(corsOptions));

app.use(express.json());

app.use("/api/cakes", cakeRoutes);

/* ---------------- ROUTES ---------------- */

// 🔐 Auth routes
app.use("/api/auth", authRoutes);

// 🛠 Admin routes
console.log("✅ Mounting admin routes at /api/admin");
app.use("/api/admin", adminRoutes);

/* ---------------- ROOT ---------------- */
app.get("/", (req, res) => {
  res.send("CakeMarket API running");
});

/* ---------------- 404 HANDLER (VERY IMPORTANT) ---------------- */
const path = require("path");

// Serve uploaded files before the 404 handler
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Return 204 for favicon requests to avoid noisy 404 logs
app.get("/favicon.ico", (req, res) => res.sendStatus(204));

/* ---------------- 404 HANDLER (VERY IMPORTANT) ---------------- */
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

const path = require("path");

// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Orders route
const orderRoutes = require("./routes/OrderRoutes");
app.use("/api/orders", orderRoutes);
