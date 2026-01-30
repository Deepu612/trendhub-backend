const { body, validationResult } = require("express-validator");
const { error } = require("../utils/response");
const bcrypt = require("bcrypt");
const User = require("../models/User");


const validateUpdateUser = [
  body("first_name")
    .notEmpty().withMessage("First name is required")
    .isString().withMessage("First name must be a string"),

  body("last_name")
    .notEmpty().withMessage("Last name is required"),

  body("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email format"),

  body("phone")
    .notEmpty().withMessage("Phone is required"),

  body("country_code")
    .optional()
    .isString().withMessage("Country code must be string"),

  body("dialer_code")
    .optional()
    .isString().withMessage("Dialer code must be string"),
];

const validateAddUser = [
  body("first_name")
    .notEmpty().withMessage("First name is required")
    .isString().withMessage("First name must be a string"),

  body("last_name")
    .notEmpty().withMessage("Last name is required"),

  body("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email format"),

  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),

  body("phone")
    .notEmpty().withMessage("Phone is required"),

  body("country_code")
    .optional()
    .isString().withMessage("Country code must be string"),

  body("dialer_code")
    .optional()
    .isString().withMessage("Dialer code must be string"),
];


const validateRegister = [
  body("first_name")
    .trim()
    .notEmpty()
    .withMessage("First name is required")
    .isLength({ min: 2, max: 60 })
    .withMessage("First name must be 2-60 characters"),

  body("last_name")
    .trim()
    .notEmpty()
    .withMessage("Last name is required")
    .isLength({ min: 2, max: 60 })
    .withMessage("Last name must be 2-60 characters"),

  body("email")
    .trim()
    .toLowerCase()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number"),

  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone is required")
    .matches(/^[+]?[0-9]{10,15}$/)
    .withMessage("Phone must be 10-15 digits"),

  body("country_code")
    .optional()
    .trim()
    .matches(/^[+]?[0-9]{1,3}$/)
    .withMessage("Invalid country code"),

  body("dialer_code")
    .optional()
    .trim()
    .matches(/^[0-9]{1,3}$/)
    .withMessage("Invalid dialer code"),
];

// Login Validation
const validateLogin = [
  body("email")
    .trim()
    .toLowerCase()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),

  body("password")
    .notEmpty()
    .withMessage("Password is required"),
];


const validateChangePassword = [
  body("old_password")
    .notEmpty()
    .withMessage("Old password is required")
    .bail()
    .custom(async (value, { req }) => {
      const userId = req.user.id; // token se aayega
      const user = await User.findByPk(userId);

      if (!user) {
        throw new Error("User not found");
      }

      const isMatch = await bcrypt.compare(value, user.password);

      if (!isMatch) {
        throw new Error("Old password is incorrect");
      }

      return true;
    }),

  body("new_password")
    .notEmpty()
    .withMessage("New password is required")
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters long")
    .bail()
    .custom((value, { req }) => {
      if (value === req.body.old_password) {
        throw new Error("New password must be different from old password");
      }
      return true;
    }),

  body("confirm_password")
    .notEmpty()
    .withMessage("Confirm password is required")
    .bail()
    .custom((value, { req }) => {
      if (value !== req.body.new_password) {
        throw new Error("New password and confirm password must match");
      }
      return true;
    }),
];




// Validation Error Handler Middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: err.param,
      message: err.msg,
    }));

    return error(res, "Validation failed", 400, formattedErrors);
  }

  next();
};

module.exports = {
  validateUpdateUser,
  validateRegister,
  validateLogin,
  validateChangePassword,
  validateAddUser,
  handleValidationErrors,
};
