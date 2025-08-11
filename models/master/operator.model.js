const { DataTypes, Model } = require("sequelize");
const sequelize = require("../../src/config/database");


const Operator = sequelize.define("Operator", {
  operatorName: DataTypes.STRING,
  address: DataTypes.STRING,
  registrationNumber: DataTypes.STRING,
  panNo: DataTypes.STRING,
  photo: DataTypes.STRING,
});

module.exports = Operator;
