const { DataTypes, Model } = require("sequelize");
const sequelize = require("../../src/config/database");

// models/vehicle.js
const Vehicle = sequelize.define("Vehicle", {
  vehicleNo: { type: DataTypes.STRING, allowNull: false },
  ownerName: { type: DataTypes.STRING, allowNull: false },
  address: { type: DataTypes.STRING, allowNull: false },
  panNo: DataTypes.STRING,
  membershipNo: DataTypes.STRING,
  photo: DataTypes.STRING,
  registrationDate: DataTypes.DATE,
});
Vehicle.associate = (models) => {
  Vehicle.hasOne(models.Operator, { foreignKey: "vehicleId", as: "operator" });
  Vehicle.hasOne(models.Helper, { foreignKey: "vehicleId", as: "helper" });
  Vehicle.hasMany(models.Driver, { foreignKey: "vehicleId", as: "drivers" });
};

module.exports = Vehicle;
