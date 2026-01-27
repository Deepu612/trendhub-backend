const { success, error } = require("../../utils/response");
const userService = require("./user.service");

const add = async (req, res) => {
    try {
        const body = req.body; // 👉 this is correct
        console.log(body, "⬅️ received body");
        const result = await userService.add(body);
        return success(res, body, "Data received", 200);
    } catch (err) {
        console.error("Add user error:", err.message);
        return error(res, "Internal server error", 500);
    }
};

module.exports = { add };
