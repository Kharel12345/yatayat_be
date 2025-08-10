// models/BranchInfo.js
const { DataTypes } = require('sequelize');
const sequelize = require('../src/config/database');

const BranchInfo = sequelize.define('BranchInfo', {
  branch_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: DataTypes.STRING,
  status: DataTypes.INTEGER
}, {
  tableName: 'branch_info',
  timestamps: false
});



module.exports = BranchInfo;
