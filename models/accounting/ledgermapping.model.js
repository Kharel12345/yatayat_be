"use strict";
const sequelize = require("../../src/config/database");

const { DataTypes } = require("sequelize");
const AccountingLedgerMapping = sequelize.define(
  "AccountingLedgerMapping",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    label: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    ledger_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    tableName: "accounting_ledger_mapping",
    timestamps: false,
  }
);

AccountingLedgerMapping.belongsTo(LedgerInfo, {
  foreignKey: 'ledger_id',
  targetKey: 'id',
  as: 'ledgerInfo',
});

module.exports = AccountingLedgerMapping;
