const express = require("express");
const router = express.Router();

const userController = require("./user.controller");
const authMiddleware = require("../../middlewares/auth.middleware");
const { validateAddUser,validateUpdateUser,handleValidationErrors } = require("../../middlewares/validation.middleware");

router.post(
  "/add",
  authMiddleware,
  validateAddUser,
  handleValidationErrors,
  userController.add
);

router.get('/detail/:id', authMiddleware, userController.detail);
router.get('/list', authMiddleware, userController.list);
router.post( "/update/:id",authMiddleware,validateUpdateUser,handleValidationErrors,userController.update);
module.exports = router;
