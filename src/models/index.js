const fs = require("fs");
const path = require("path");
const sequelize = require("../config/db");
const Sequelize = require("sequelize");

const db = {};
const basename = path.basename(__filename);

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file !== basename &&
      file.endsWith(".js")
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file));

    // Function based model initialization
    const initializedModel = model;

    db[initializedModel.name] = initializedModel;
  });

// Add sequelize instance
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
