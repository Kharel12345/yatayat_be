const { DataTypes, Model } = require("sequelize");
const sequelize = require("../../src/config/database");
const BranchInfo = require("../branch.model");
const BillingTitleInfo = require("./billing_title.model");
const LabelInfo = require("./label_info.model");
const User = require("../user.model");
 
const BillingTitleMappingInfo = sequelize.define(
  "BillingTitleMappingInfo",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    billing_title_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "billing_title_info",
        key: "billing_title_id",
      },
    },
    label_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "label_info",
        key: "id",
      },
    },
    branch_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "branch_info",
        key: "branch_id",
      },
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "user",
        key: "user_id",
      },
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      onUpdate: DataTypes.NOW,
    },
  },
  {
    tableName: "billing_title_mapping_info",
    timestamps: false,
    underscored: true,
  }
);


BillingTitleMappingInfo.belongsTo(BranchInfo, {
  foreignKey: "branch_id",
  targetKey: "branch_id",
  as: "branchInfo",
});


BillingTitleMappingInfo.belongsTo(BillingTitleInfo, {
  foreignKey: "billing_title_id",
  targetKey: "billing_title_id",
  as: "billingInfo",
});



BillingTitleMappingInfo.belongsTo(LabelInfo, {
  foreignKey: "label_id",
  targetKey: "id",
  as: "labelInfo",
});


BillingTitleMappingInfo.belongsTo(User, {
  foreignKey: "created_by",
  targetKey: "user_id",
  as: "userInfo",
});

module.exports = BillingTitleMappingInfo;