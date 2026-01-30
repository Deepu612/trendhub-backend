const { Attribute } = require("../../models");
const { success } = require("../../utils/response");

const add = async (payload) => {

    if (!payload.name) {
        return {
            success: false,
            message: "Attribute name is required"
        };
    }

    const existing = await Attribute.findOne({
        where: { name: payload.name }
    });

    if (existing) {
        return {
            success: false,
            message: "Attribute already exists."
        };
    }

    const attribute = await Attribute.create({
        name: payload.name
    });

    return {
        success: true,
        data: attribute,
        message: "Attribute created successfully."
    };
};

const details = async (payload) => {

    if (!payload.id) {
        return {
            success: false,
            message: "payload id missing."
        };
    }

    const result = await Attribute.findOne({
        where: {
            id: payload.id
        }
    });

    if (!result) {
        return {
            success: false,
            message: "Attribute not found."
        };
    }

    return {
        success: true,
        data: result
    };
};


module.exports = { add, details };
