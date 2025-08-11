const { DataTypes, Model } = require("sequelize");
const sequelize = require("../../src/config/database");

const Helper = sequelize.define("Helper", {
  helperName: DataTypes.STRING,
  address: DataTypes.STRING,
  registrationNumber: DataTypes.STRING,
  panNo: DataTypes.STRING,
  photo: DataTypes.STRING,
});

module.exports = Helper;
