const { User, Role, UserRole } = require("../../models");
const { success } = require("../../utils/response");
const { Op } = require('sequelize');

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
      message: "User created successfully.",
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

const detail = async (id) => {
  const userDetail = await User.findByPk(id, {
    attributes: { exclude: ['password'] } // optional
  });

  if (!userDetail) {
    return {
      success: false,
      message: "User not found."
    };
  }

  return {
    success: true,
    data: userDetail
  };
};


const update = async (id, payload) => {
  const user = await User.findByPk(id);

  if (!user) {
    return {
      success: false,
      message: "User not found"
    };
  }

  await user.update({
    first_name: payload.first_name,
    last_name: payload.last_name,
    email: payload.email,
    mobile: payload.mobile,
    dob: payload.dob,
    gender: payload.gender,
    phone: payload.phone
    // future fields yahin clearly add honge
  });

  return {
    success: true,
    data: user
  };
};



const list = async (payload) => {
  const page = payload.page;
  const limit = payload.limit;
  const offset = (page - 1) * limit;

  const where = {};

  if (payload.status) {
    where.status = payload.status;
  }

  if (payload.search) {
    where[Op.or] = [
      { first_name: { [Op.like]: `%${payload.search}%` } },
      { email: { [Op.like]: `%${payload.search}%` } }
    ];
  }

  const result = await User.findAndCountAll({
    where,
    attributes: [
      'id',
      'first_name',
      'last_name',
      'email',
      'status',
      'created_at'
    ],
    limit,
    offset,
    order: [['created_at', 'DESC']],
    raw: true // 🔥 important
  });

  return {
    rows: result.rows,
    pagination: {
      page,
      limit,
      total: result.count,
      total_pages: Math.ceil(result.count / limit)
    }
  };
};


module.exports = { add, detail, update, list };
