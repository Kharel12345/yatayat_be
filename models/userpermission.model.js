const { DataTypes } = require("sequelize");
const sequelize = require("../src/config/database");


const UserPermissionInfo = sequelize.define('UserPermissionInfo', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    permission: {
        type: DataTypes.JSON,
        allowNull: false
    },
    status: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },
    created_by: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'user_permission_info',
    timestamps: false
});


module.exports = UserPermissionInfo;