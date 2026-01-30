const attributeService = require("./attribute.service");
const { success, error } = require("../../utils/response");

const add = async (req, res) => {
    try {
        const payload = req.body;
        const result = await attributeService.add(payload);

        if (!result.success) {
            return error(res, result.message, 400);
        }

        return success(res, result.data, result.message, 200);

    } catch (err) {
        console.error("ATTRIBUTE ADD ERROR =>", err);
        return error(res, err.message, 500);
    }
};

const details = async (req, res) => {
    try {
        const payload = req.body;
        const result = await attributeService.details(payload);
        if (!result.success) {
            return error(res, result.message, 400);
        }
        return success(res, result.data, result.message, 200);

    } catch (err) {
        return error(res, err.message, 500);
    }
}

module.exports = { add, details };
