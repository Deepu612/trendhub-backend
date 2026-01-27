const jwt = require("jsonwebtoken");
const { error } = require("../utils/response");
const { UserSession } = require("../models");

const authMiddleware = async (req, res, next) => {
  try {
    // Validate Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return error(res, "TOKEN_REQUIRED", 401);
    }

    const token = authHeader.split(" ")[1];

    // Verify access token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return error(res, "ACCESS_TOKEN_EXPIRED", 401);
      }
      return error(res, "INVALID_ACCESS_TOKEN", 401);
    }

    req.user = decoded;
    next();

  } catch (err) {
    console.error("AUTH ERROR:", err.message);
    return error(res, "AUTHENTICATION_FAILED", 401);
  }
};

module.exports = authMiddleware;
