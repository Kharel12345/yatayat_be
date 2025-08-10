// // models/user.js
const { DataTypes } = require('sequelize');
const sequelize = require('../src/config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  name: DataTypes.STRING,
  address: DataTypes.STRING,
  contact: DataTypes.STRING,
  status: DataTypes.INTEGER,
  user_type: DataTypes.STRING,
  created_by: DataTypes.INTEGER
}, {
  tableName: 'user',
  timestamps: false
});


module.exports = User;
