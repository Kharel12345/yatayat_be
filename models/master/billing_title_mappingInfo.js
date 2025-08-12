const { DataTypes, Model } = require("sequelize");
const sequelize = require("../../src/config/database");
 
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

BillingTitleMappingInfo.associate = function (models) {
  BillingTitleMappingInfo.belongsTo(models.BillingTitleInfo, {
    foreignKey: "billing_title_id",
    as: "billing_title",
  });
  BillingTitleMappingInfo.belongsTo(models.LabelInfo, {
    foreignKey: "label_id",
    as: "label",
  });
  BillingTitleMappingInfo.belongsTo(models.BranchInfo, {
    foreignKey: "branch_id",
    as: "branch",
  });
  BillingTitleMappingInfo.belongsTo(models.User, {
    foreignKey: "created_by",
    as: "creator",
  });
};
