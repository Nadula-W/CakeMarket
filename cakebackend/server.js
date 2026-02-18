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

/* ---------------- PROXY (Render) ---------------- */
app.set("trust proxy", 1);

/* ---------------- MIDDLEWARE ---------------- */
app.use(express.json());

// ✅ Allow multiple origins safely (Vercel + localhost)
const allowedOrigins = [
  (process.env.FRONTEND_URL || "").trim().replace(/\/$/, ""),
  "http://localhost:3000",
  "http://127.0.0.1:3000",
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin (like Postman, curl)
    if (!origin) return callback(null, true);

    const cleanOrigin = origin.trim().replace(/\/$/, "");
    if (allowedOrigins.includes(cleanOrigin)) {
      return callback(null, true);
    }

    console.error("❌ CORS blocked origin:", origin);
    return callback(new Error("Not allowed by CORS"), false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// ✅ ensure preflight always responds
app.options("*", cors(corsOptions));

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
