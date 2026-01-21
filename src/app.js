const express = require("express");
const app = express();

app.use(express.json());

// SAFE IMPORT HELPERS
function safeUseRoute(path, routePath) {
  try {
    const route = require(routePath);
    if (typeof route !== "function") {
      console.error(` Route is not a function: ${routePath}`);
      return;
    }
    app.use(path, route);
    console.log(` Loaded route: ${path}`);
  } catch (err) {
    console.error(` Failed to load route ${routePath}:`, err.message);
  }
}

// -------------------------
// SAFE ROUTE REGISTER
// -------------------------
// safeUseRoute("/api/auth", "./modules/auth/auth.routes");
// safeUseRoute("/api/products", "./modules/products/product.routes");
// safeUseRoute("/api/variants", "./modules/variants/variant.routes");
// safeUseRoute("/api/media", "./modules/media/media.routes");

// -------------------------
// DEFAULT HEALTH CHECK ROUTE
// -------------------------
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Server is working 🚀",
    uptime: process.uptime(),
  });
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
