// models/UserBranchInfo.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user.model');
const BranchInfo = require('./branch.model');

const UserBranchInfo = sequelize.define('UserBranchInfo', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: DataTypes.INTEGER,
  branch_id: DataTypes.INTEGER,
  created_by: DataTypes.INTEGER,
  status: DataTypes.INTEGER
}, {
  tableName: 'user_branch_info',
  timestamps: false
});

// UserBranchInfo.belongsTo(User, { foreignKey: 'user_id' });

// UserBranchInfo.belongsTo(BranchInfo, { foreignKey: 'branch_id' });


module.exports = UserBranchInfo;
