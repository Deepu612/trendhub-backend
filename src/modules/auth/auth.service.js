const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../models").User; // Assuming User model exists
const UserSession= require("../../models").UserSession;
const crypto = require("crypto");

// Require dotenv
require("dotenv").config();

// Login Service
const loginUser = async (email, password, deviceInfo) => {
  try {
    // 1) Check user exist
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return {
        success: false,
        message: "Invalid email or password",
        statusCode: 401,
      };
    }

    // 2) Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return {
        success: false,
        message: "Invalid email or password",
        statusCode: 401,
      };
    }

    // 3) Create Access Token (3 hours)
    const accessToken = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "3h" }
    );

    // 4) Create Refresh Token (long-lived)
    const refreshToken = crypto.randomUUID();

    // 5) Store refresh token session
    await UserSession.create({
      user_id: user.id,
      refresh_token: refreshToken,
      device_info: deviceInfo
    });

    // 6) Success response
    return {
      success: true,
      message: "Login successful",
      statusCode: 200,
      data: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone,
        accessToken,
        refreshToken,
      },
    };

  } catch (err) {
    console.error("Login service error:", err.message);
    return {
      success: false,
      message: "Login failed",
      statusCode: 500,
    };
  }
};




// Register Service
const registerUser = async (userData) => {
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email: userData.email } });

    if (existingUser) {
      return {
        success: false,
        message: "Email already exists",
        statusCode: 400,
      };
    }

    // Create new user
    const user = await User.create(userData);

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    return {
      success: true,
      message: "Registration successful",
      statusCode: 201,
      data: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone,
        token,
      },
    };
  } catch (err) {
    console.error("Register service error:", err.message);
    return {
      success: false,
      message: "Registration failed",
      statusCode: 500,
    };
  }
};

// Get User Details Service
const getUserDetails = async (userId) => {
  try {
    // Find user by ID
    const user = await User.findByPk(userId, {
      attributes: {
        exclude: ["password"], // Password ko exclude karo
      },
    });

    if (!user) {
      return {
        success: false,
        message: "User not found",
        statusCode: 404,
      };
    }

    return {
      success: true,
      message: "User details retrieved successfully",
      statusCode: 200,
      data: user,
    };
  } catch (err) {
    console.error("Get details service error:", err.message);
    return {
      success: false,
      message: "Failed to retrieve user details",
      statusCode: 500,
    };
  }
};



const changePassword = async (userId, oldPassword, newPassword, confirmPassword) => {
 
  const user = await User.findByPk(userId);
  if (!user) {
    throw { status: 404, message: "User not found" };
  }

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) {
    throw { status: 400, message: "Old password is incorrect" };
  }

  if (oldPassword === newPassword) {
    throw { status: 400, message: "New password must be different from old password" };
  }

  if (newPassword !== confirmPassword) {
    throw { status: 400, message: "New password and confirm password must match" };
  }

  const hashed = await bcrypt.hash(newPassword, 10);

  await User.update(
    { password: hashed },
    { where: { id: userId } }
  );

  return { message: "Password updated successfully" };
};

const logoutUser = async (refreshToken) => {
  if (!refreshToken) {
    throw { status: 400, message: "Refresh token is required" };
  }

  const session = await UserSession.findOne({
    where: { refresh_token: refreshToken }
  });

  if (!session) {
    throw { status: 401, message: "Invalid refresh token" };
  }

  await UserSession.destroy({
    where: { refresh_token: refreshToken }
  });

  return { message: "Logged out successfully" };
};



module.exports = {
  logoutUser,
  changePassword,
  loginUser,
  registerUser,
  getUserDetails,
};
