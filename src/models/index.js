const sequelize = require("../config/db");
const User = require("./User");

// Sync all models with database
(async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log("✅ Database models synced successfully");
  } catch (err) {
    console.error("❌ Failed to sync models:", err.message);
  }
})();

module.exports = {
  sequelize,
  User,
};
