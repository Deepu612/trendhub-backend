const express = require("express");
const router = express.Router();

const userController = require("./user.controller");
const authMiddleware = require("../../middlewares/auth.middleware");
const { validateAddUser,handleValidationErrors } = require("../../middlewares/validation.middleware");

router.post(
  "/add",
  authMiddleware,
  validateAddUser,
  handleValidationErrors,
  userController.add
);

module.exports = router;
