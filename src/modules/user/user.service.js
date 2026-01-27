const { User, Role, UserRole } = require("../../models");

const add = async (data) => {
  try {
    // 1) Check if email exists
    const checkEmail = await User.findOne({
      where: { email: data.email }
    });

    if (checkEmail) {
      return {
        success: false,
        message: "Email already exists",
        statusCode: 400
      };
    }

    // 2) Role check
    const role = await Role.findOne({
      where: { slug: data.role }
    });

    if (!role) {
      return {
        success: false,
        message: "Invalid role",
        statusCode: 400
      };
    }

    // 3) Create user
    const user = await User.create({
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      password: data.password, // hashing auto hook
      phone: data.phone
    });

    // 4) Assign role => user_roles table me entry
    await UserRole.create({
      user_id: user.id,
      role_id: role.id
    });

    return {
      success: true,
      message: "User created successfully",
      statusCode: 201,
      data: {
        user_id: user.id,
        role_id: role.id,
        slug: role.slug,
        email: user.email
      }
    };

  } catch (err) {
    console.error("Add user service error:", err.message);

    return {
      success: false,
      message: "Failed to create user",
      statusCode: 500
    };
  }
};

module.exports = { add };
