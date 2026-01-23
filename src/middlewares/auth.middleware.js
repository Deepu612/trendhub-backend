const jwt = require("jsonwebtoken");
const { error } = require("../utils/response");
const UserSession = require("../models/UserSession");  // to verify session is alive

const authMiddleware = async (req, res, next) => {
  try {
    // Token is required
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return error(res, "TOKEN_REQUIRED", 401);
    }

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

    // Check if user session exists (global logout case)
    // OPTION: If you want strict session verification for each request:
    const sessionExists = await UserSession.findOne({
      where: { user_id: decoded.id }
    });

    if (!sessionExists) {
      return error(res, "SESSION_EXPIRED", 401);
    }

    req.user = decoded;
    next();

  } catch (err) {
    console.error("AUTH ERROR:", err.message);
    return error(res, "AUTHENTICATION_FAILED", 401);
  }
};

module.exports = authMiddleware;
