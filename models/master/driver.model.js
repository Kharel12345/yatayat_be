const { DataTypes, Model } = require("sequelize");
const sequelize = require("../../src/config/database");
 
 
 const Driver = sequelize.define('Driver', {
    driverName: DataTypes.STRING,
    registrationNumber: DataTypes.STRING,
    panNo: DataTypes.STRING,
    licenseNo: DataTypes.STRING,
    photo: DataTypes.STRING,
    address: DataTypes.STRING
  });

  module.exports=Driver;