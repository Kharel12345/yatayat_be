const MessageSetting = require("../../../models/master/message_setting.model");

const upsertMessageSetting = async (data) => {
    if (!data.message_setting_type) {
        const error = new Error("message_setting_type is required");
        error.statusCode = 400;
        throw error;
    }

    const existing = await MessageSetting.findOne({
        where: {
            created_by: data.created_by,
            message_setting_type: data.message_setting_type,
        },
    });

    if (existing) {
        return await existing.update(data);
    }

    return await MessageSetting.create(data);
};

const getMessageSetting = async () => {
    return await MessageSetting.findAll({
        order: [["created_at", "DESC"]],
    });
};

// all of a user's settings (used by admin-style views, if ever needed)
const getMessageSettingByUser = async (userId) => {
    return await MessageSetting.findAll({
        where: { created_by: userId },
        order: [["message_setting_type", "ASC"]],
    });
};

// NEW: exactly one setting, matching both user AND type
const getMessageSettingByUserAndType = async (userId, type) => {
    return await MessageSetting.findOne({
        where: { created_by: userId, message_setting_type: type },
    });
};

const updateMessageSetting = async (id, userId, data) => {
    const existing = await MessageSetting.findOne({
        where: { id, created_by: userId },
    });
    if (!existing) {
        const error = new Error("Message not found");
        error.statusCode = 404;
        throw error;
    }
    return await existing.update(data);
};

const deleteMessageSetting = async (id, userId) => {
    const existing = await MessageSetting.findOne({
        where: { id, created_by: userId },
    });
    if (!existing) {
        const error = new Error("Message not found");
        error.statusCode = 404;
        throw error;
    }
    await existing.destroy();
    return existing;
};

module.exports = {
    upsertMessageSetting,
    getMessageSetting,
    getMessageSettingByUser,
    getMessageSettingByUserAndType,
    updateMessageSetting,
    deleteMessageSetting,
};