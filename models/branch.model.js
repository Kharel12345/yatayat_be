// models/BranchInfo.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const UserBranchInfo = require('./userbranch.model');

const BranchInfo = sequelize.define('BranchInfo', {
  branch_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: DataTypes.STRING,
  status: DataTypes.INTEGER
}, {
  tableName: 'branch_info',
  timestamps: false
});

// BranchInfo.hasMany(UserBranchInfo, { foreignKey: 'branch_id' });


module.exports = BranchInfo;
