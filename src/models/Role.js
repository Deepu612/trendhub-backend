const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Role = sequelize.define(
  "Role",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    slug: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    }
  },
  {
    tableName: "roles",
    timestamps: false
  }
);

module.exports = Role;
