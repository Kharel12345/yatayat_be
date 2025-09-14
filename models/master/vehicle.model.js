const { DataTypes } = require("sequelize");
const sequelize = require("../../src/config/database");
const LedgerInfo = require("../accounting/ledger.model");

const Vehicle = sequelize.define(
  "Vehicle",
  {
    vehicleNo: { type: DataTypes.STRING, allowNull: false },
    ownerName: { type: DataTypes.STRING, allowNull: false },
    address: { type: DataTypes.STRING, allowNull: false },
    contact: { type: DataTypes.STRING, allowNull: true },
    panNo: { type: DataTypes.STRING, allowNull: true },
    membershipNo: { type: DataTypes.STRING, allowNull: true },
    photo: { type: DataTypes.STRING, allowNull: true },
    billbookphoto: { type: DataTypes.STRING, allowNull: true },
    licensePaper: { type: DataTypes.STRING, allowNull: true },
    insurancePaper: { type: DataTypes.STRING, allowNull: true },
    routePermit: { type: DataTypes.STRING, allowNull: true },
    jachPass: { type: DataTypes.STRING, allowNull: true },
    registrationDate: { type: DataTypes.DATE, allowNull: false },
    categoryId: { type: DataTypes.INTEGER, allowNull: true },
    subCategoryId: { type: DataTypes.INTEGER, allowNull: true },
    branchId: { type: DataTypes.INTEGER, allowNull: true },
    organization: { type: DataTypes.STRING, allowNull: true },
    subscriptionType: { type: DataTypes.STRING, allowNull: false },
    functionalYear: { type: DataTypes.STRING, allowNull: true },
    status: { type: DataTypes.TINYINT, defaultValue: 1 },
    createdBy: { type: DataTypes.INTEGER, allowNull: true },
    ledgerId: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    tableName: "Vehicles",
    timestamps: true,
  }
);

Vehicle.associate = (models) => {
  Vehicle.hasOne(models.Operator, { foreignKey: "vehicleId", as: "operator" });
  Vehicle.hasOne(models.Helper, { foreignKey: "vehicleId", as: "helper" });
  Vehicle.hasMany(models.Driver, { foreignKey: "vehicleId", as: "drivers" });

  // Billing associations
  if (models.VehicleSubscription) {
    Vehicle.hasMany(models.VehicleSubscription, {
      foreignKey: "vehicle_id",
      as: "subscriptions",
    });
  }
  Vehicle.belongsTo(LedgerInfo, {
    foreignKey: "ledgerId",
    as: "ledger",
  });

  if (models.SubscriptionPayment) {
    Vehicle.hasMany(models.SubscriptionPayment, {
      foreignKey: "vehicle_id",
      as: "payments",
    });
  }
};

module.exports = Vehicle;
