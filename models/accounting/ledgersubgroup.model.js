"use strict";
const sequelize = require('../../src/config/database');

const { DataTypes } = require("sequelize");
const AccountingLedgerSubGroup = sequelize.define(
  "AccountingLedgerSubGroup",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    sub_group_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    is_editable: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "accounting_ledgersub_group",
    timestamps: false,
  }
);

module.exports = AccountingLedgerSubGroup;
