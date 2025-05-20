const jwt = require("jsonwebtoken");
const User = require("../models/User.js");

const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token)
    return res.status(401).json({ message: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // {id, role}

    // Optional: fetch full user info if needed
    const user = await User.findById(req.user.id);
    if (!user) return res.status(401).json({ message: "User not found" });

    req.user.role = user.role; // just to be safe
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

// Role-based middleware
const authorizeRole = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};

module.exports = { authMiddleware, authorizeRole };
