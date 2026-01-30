const { success, error } = require("../../utils/response");
const userService = require("./user.service");


const list = async (req, res) => {
    try {
        const payload = req.query;

        const page = payload.page;
        const limit = payload.limit;

        // 🔴 validation
        if (!page || !limit) {
            return res.status(400).json({
                success: false,
                message: "page and limit are required"
            });
        }

        if (isNaN(page) || isNaN(limit)) {
            return res.status(400).json({
                success: false,
                message: "page and limit must be numbers"
            });
        }

        // optional: normalize
        payload.page = Number(page);
        payload.limit = Number(limit);

        // 👉 as-it-is service ko pass
        const result = await userService.list(payload);

        return res.status(200).json({
            success: true,
            data: result
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};


const add = async (req, res) => {
    try {
        const body = req.body; // 👉 this is correct
        console.log(body, "⬅️ received body");
        const result = await userService.add(body);
        return success(res, result.message);
    } catch (err) {
        console.error("Add user error:", err.message);
        return error(res, "Internal server error", 500);
    }
};

const detail = async (req, res) => {
    try {
        const encodedId = req.params.id;

        // decode base64
        const id = Buffer.from(encodedId, 'base64').toString('utf8');

        // optional: number conversion
        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user id"
            });
        }

        const result = await userService.detail(Number(id));

        if (!result.success) {
            return res.status(404).json(result);
        }

        return res.status(200).json(result);

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

const update = async (req, res) => {
    try {
        const encodedId = req.params.id;   // base64 id
        const payload = req.body;          // update data

        if (!encodedId) {
            return res.status(400).json({
                success: false,
                message: "User id is required"
            });
        }

        // 🔓 decode base64 id
        let id;
        try {
            id = Buffer.from(encodedId, "base64").toString("utf8");
        } catch (e) {
            return res.status(400).json({
                success: false,
                message: "Invalid encoded id"
            });
        }

        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user id"
            });
        }

        // 👉 service call
        const result = await userService.update(Number(id), payload);

        if (!result.success) {
            return res.status(404).json(result);
        }

        return res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: result.data
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};


module.exports = { add, detail, update,list };
