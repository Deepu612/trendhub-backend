const express = require("express");
const router = express.Router();
const authController = require("./auth.controller");
const authMiddleware = require("../../middlewares/auth.middleware");
const {
  validateRegister,
  validateLogin,
  validateChangePassword,
  handleValidationErrors,
} = require("../../middlewares/validation.middleware");

// POST /api/auth/register
router.post("/register", validateRegister, handleValidationErrors, authController.register);
router.post("/login", validateLogin, handleValidationErrors, authController.login);

router.get("/details", authMiddleware, authController.getDetails);
router.post("/logout", authMiddleware, authController.logout);
router.post("/change-password", authMiddleware, validateChangePassword, handleValidationErrors, authController.changePassword);


module.exports = router;
