const UserPermissionInfo = require("../../../models/userpermission.model");


const getUserModuleDetails = async (user_id) => {
    const result = await UserPermissionInfo.findAll({
        where: {
            user_id,
            status: 1
        },
        attributes: ['id', 'permission', 'status', 'created_by']
    });

    return result;
};

const createUserPermission = async (obj) => {
    const { user_id, permission, created_by } = obj;

    const result = await UserPermissionInfo.create({
        user_id,
        permission, // No need to stringify, Sequelize handles JSON
        created_by
    });

    return result;
};

const updateUserPermission = async (obj) => {
    const { user_id, permission } = obj;

    const result = await UserPermissionInfo.update(
        { permission },
        { where: { user_id } }
    );

    return result;
};

module.exports = {
    getUserModuleDetails,
    createUserPermission,
    updateUserPermission
};
