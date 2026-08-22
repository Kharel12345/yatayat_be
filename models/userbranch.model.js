// models/UserBranchInfo.js
const { DataTypes } = require('sequelize');
const sequelize = require('../src/config/database');

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



module.exports = UserBranchInfo;
