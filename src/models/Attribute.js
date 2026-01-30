const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Attribute = sequelize.define(
  "Attribute",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(60),
      allowNull: false,
      unique: true
    }
  },
  {
    tableName: "attributes",
    timestamps: false
  }
);

module.exports = Attribute;
