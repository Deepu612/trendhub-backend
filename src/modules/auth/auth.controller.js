const { success, error } = require("../../utils/response");
const authService = require("./auth.service");

// Login Controller
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return error(res, "Email and password are required", 400);
    }

    // Call service
    const result = await authService.loginUser(email, password);

    if (!result.success) {
      return error(res, result.message, result.statusCode || 401);
    }

    return success(res, result.data, result.message, 200);
  } catch (err) {
    console.error("Login error:", err.message);
    return error(res, "Internal server error", 500);
  }
};

// Register Controller
const register = async (req, res) => {
  try {
    const { first_name, last_name, email, password, phone, country_code, dialer_code } = req.body;

    // Validate input
    if (!first_name || !last_name || !email || !password || !phone) {
      return error(res, "First name, last name, email, password, and phone are required", 400);
    }

    // Call service
    const result = await authService.registerUser({
      first_name,
      last_name,
      email,
      password,
      phone,
      country_code,
      dialer_code,
    });

    if (!result.success) {
      return error(res, result.message, result.statusCode || 400);
    }

    return success(res, result.data, result.message, 200);
  } catch (err) {
    console.error("Register error:", err.message);
    return error(res, "Internal server error", 500);
  }
};

// Get User Details Controller
const getDetails = async (req, res) => {
  try {
    // req.user token se aata hai (authMiddleware se)
    const result = await authService.getUserDetails(req.user.id);

    if (!result.success) {
      return error(res, result.message, result.statusCode || 400);
    }

    return success(res, result.data, result.message, 200);
  } catch (err) {
    console.error("Get details error:", err.message);
    return error(res, "Internal server error", 500);
  }
};

const changePassword = async (req, res) => {
  try {
    const { old_password, new_password, confirm_password } = req.body;

    const result = await authService.changePassword(
      req.user.id,         // user id from token
      old_password,
      new_password,
      confirm_password
    );

    return success(res, result.message);

  } catch (err) {
    console.error("change password error::", err.message);
    return error(res, err.message || "Internal server error", err.status || 500);
  }
};

module.exports = {
  login,
  register,
  getDetails,
  changePassword,
};
