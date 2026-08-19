"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../src/config/database");

class IndexInfo extends Model {
  static associate(models) {
    // Example: If you want to relate to FunctionalYear model
    // IndexInfo.belongsTo(models.FunctionalYear, {
    //   foreignKey: 'functional_year_id',
    //   as: 'functionalYear'
    // });
  }
}

IndexInfo.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    functional_year_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    index_code: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    max_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.TINYINT,
      defaultValue: 1,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    modelName: "IndexInfo",
    tableName: "index_info",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = IndexInfo;
