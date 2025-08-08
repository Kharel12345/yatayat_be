// // models/user.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const UserBranchInfo = require('./userbranch.model');

const User = sequelize.define('User', {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: DataTypes.STRING,
  address: DataTypes.STRING,
  contact: DataTypes.STRING,
  username: {
    type: DataTypes.STRING,
    unique: true
  },
  password: DataTypes.STRING,
  status: DataTypes.INTEGER,
  user_type: DataTypes.STRING,
  created_by: DataTypes.INTEGER
}, {
  tableName: 'user',
  timestamps: false
});

// User.hasMany(UserBranchInfo, { foreignKey: 'user_id' });


module.exports = User;
