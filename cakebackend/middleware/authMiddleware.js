const jwt = require("jsonwebtoken");

exports.protect = (req, res, next) => {
  // Allow preflight requests to pass
  if (req.method === "OPTIONS") return next();

  const authHeader = req.headers.authorization;

  // Must be: "Bearer <token>"
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Not authorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Normalize user id (your routes use req.user.id)
    const userId = decoded.id || decoded._id || decoded.userId;

    if (!userId) {
      return res.status(401).json({ message: "Token payload invalid" });
    }

    req.user = {
      ...decoded,
      id: userId, // ✅ now req.user.id always exists
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: "Token invalid" });
  }
};

// Baker-only access
exports.bakerOnly = (req, res, next) => {
  if (!req.user?.role || req.user.role !== "baker") {
    return res.status(403).json({ message: "Bakers only" });
  }
  next();
};

exports.adminOnly = (req, res, next) => {
  if (!req.user?.role || req.user.role !== "admin") {
    return res.status(403).json({ message: "Admins only" });
  }
  next();
};
