const express = require("express");
const sequelize = require("./config/db");
const { User } = require("./models");
const upload = require("./middlewares/multer.middleware");
const app = express();

app.use(express.json());

// ✅ MULTER MIDDLEWARE - Apply to all routes
app.use(upload.any()); // any() = ek ya zyada files le sakta hai

// SAFE IMPORT HELPERS
function safeUseRoute(path, routePath) {
  try {
    const route = require(routePath);
    // Check if it's a valid route (function or express router)
    if (typeof route !== "function" && !route.stack) {
      console.error(` Route is not valid: ${routePath}`);
      return;
    }
    app.use(path, route);
    console.log(` ✅ Loaded route: ${path}`);
  } catch (err) {
    console.error(` ❌ Failed to load route ${routePath}:`, err.message);
  }
}

// -------------------------
// SAFE ROUTE REGISTER
// -------------------------
safeUseRoute("/api/auth", "./modules/auth/auth.routes");
safeUseRoute("/api/user", "./modules/user/user.routes");
safeUseRoute("/api/attribute", "./modules/attribute/attribute.routes");
// safeUseRoute("/api/variants", "./modules/variants/variant.routes");
// safeUseRoute("/api/media", "./modules/media/media.routes");

// -------------------------
// DEFAULT HEALTH CHECK ROUTE + DB TEST
// -------------------------
app.get("/", async (req, res) => {

  
  try {
    await sequelize.authenticate();
    res.json({
      success: true,
      message: "Server is working 🚀",
      database: "✅ Connected",
      uptime: process.uptime(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server is working but Database connection failed",
      database: "❌ Disconnected",
      error: error.message,
    });
  }
});

// -------------------------
// GLOBAL ERROR HANDLER
// -------------------------
app.use((err, req, res, next) => {
  console.error(" GLOBAL ERROR:", err.stack);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

module.exports = app;
