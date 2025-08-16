const { DataTypes } = require("sequelize");
const sequelize = require("../../src/config/database");

const Operator = sequelize.define(
  "Operator",
  {
    operatorName: { type: DataTypes.STRING, allowNull: true },
    address: { type: DataTypes.STRING, allowNull: true },
    registrationNumber: { type: DataTypes.STRING, allowNull: true },
    panNo: { type: DataTypes.STRING, allowNull: true },
    photo: { type: DataTypes.STRING, allowNull: true },
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
    tableName: "Operators",
    timestamps: true, // adds createdAt and updatedAt
  }
);

Operator.associate = (models) => {
  Operator.belongsTo(models.Vehicle, { foreignKey: "vehicleId", as: "vehicle" });
};

module.exports = Operator;
