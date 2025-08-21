const { DataTypes, Model } = require("sequelize");
const sequelize = require("../../src/config/database");
const BranchInfo = require("../branch.model");
 

const BillingTitleInfo = sequelize.define(
  "BillingTitleInfo",
  {
    billing_title_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    billing_title_code: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    billing_title: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    rate: {
      type: DataTypes.DOUBLE(50, 2),
      allowNull: false,
    },
    branch_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    functional_year_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.TINYINT,
      defaultValue: 1,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "billing_title_info",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

BillingTitleInfo.belongsTo(BranchInfo, {
  foreignKey: "branch_id",
  targetKey: "branch_id",
  as: "branch",
});

module.exports = BillingTitleInfo;
