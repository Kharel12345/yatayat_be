const { DataTypes } = require("sequelize");
const sequelize = require("../../src/config/database");

const Driver = sequelize.define(
  "Driver",
  {
    driverName: { type: DataTypes.STRING, allowNull: true },
    registrationNumber: { type: DataTypes.STRING, allowNull: true },
    panNo: { type: DataTypes.STRING, allowNull: true },
    licenseNo: { type: DataTypes.STRING, allowNull: true },
    photo: { type: DataTypes.STRING, allowNull: true },
    address: { type: DataTypes.STRING, allowNull: true },
    vehicleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Vehicles",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    status: { type: DataTypes.TINYINT, defaultValue: 1 },
    createdBy: { type: DataTypes.INTEGER, allowNull: true },
  },
  {
    tableName: "Drivers",
    timestamps: true, // adds createdAt and updatedAt
  }
);

Driver.associate = (models) => {
  Driver.belongsTo(models.Vehicle, { foreignKey: "vehicleId", as: "vehicle" });
};

module.exports = Driver;
