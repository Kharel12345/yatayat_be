// models/vehicle.js
const { DataTypes } = require("sequelize");
const sequelize = require("../../src/config/database");

const Vehicle = sequelize.define(
  "Vehicle",
  {
    vehicleNo: { type: DataTypes.STRING, allowNull: false },
    ownerName: { type: DataTypes.STRING, allowNull: false },
    address: { type: DataTypes.STRING, allowNull: false },
    panNo: { type: DataTypes.STRING, allowNull: true },
    membershipNo: { type: DataTypes.STRING, allowNull: true },
    photo: { type: DataTypes.STRING, allowNull: true },
    registrationDate: { type: DataTypes.DATE, allowNull: true },
    categoryId: { type: DataTypes.INTEGER, allowNull: true },
    subCategoryId: { type: DataTypes.INTEGER, allowNull: true },
    branchId: { type: DataTypes.INTEGER, allowNull: true },
    organization: { type: DataTypes.STRING, allowNull: true },
    functionalYear: { type: DataTypes.STRING, allowNull: true },
    status: { type: DataTypes.TINYINT, defaultValue: 1 },
    createdBy: { type: DataTypes.INTEGER, allowNull: true },
  },
  {
    tableName: "Vehicles",
  }
);

// Associations
Vehicle.associate = (models) => {
  Vehicle.hasOne(models.Operator, { foreignKey: "vehicleId", as: "operator" });
  Vehicle.hasOne(models.Helper, { foreignKey: "vehicleId", as: "helper" });
  Vehicle.hasMany(models.Driver, { foreignKey: "vehicleId", as: "drivers" });
};

module.exports = Vehicle;
