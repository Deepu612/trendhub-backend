const jwt = require("jsonwebtoken");
const { error } = require("../utils/response");

// Verify JWT Token Middleware
const authMiddleware = (req, res, next) => {
  try {
    // Get token from headers
    const token = req.headers.authorization?.split(" ")[1]; // "Bearer token" se token nikal lo

    if (!token) {
      return error(res, "Token is required", 401);
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to request
    req.user = decoded;

    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return error(res, "Token has expired", 401);
    }
    if (err.name === "JsonWebTokenError") {
      return error(res, "Invalid token", 401);
    }
    return error(res, "Authentication failed", 401);
  }
};

module.exports = authMiddleware;
