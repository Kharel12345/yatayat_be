const { DataTypes } = require('sequelize');
const sequelize = require('../../src/config/database');
const AccountingLedgerGroup = require('./ledgergroup.model');
const AccountingLedgerSubGroup = require('./ledgersubgroup.model');
const BranchInfo = require('../branch.model');

const LedgerInfo = sequelize.define('LedgerInfo', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  ledgername: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  ledger_type: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  master_ledger_group_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  ledger_sub_group_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  address: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  contact: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  opening_balance: {
    type: DataTypes.DOUBLE(50, 2),
    allowNull: true,
    defaultValue: 0.00,
  },
  opening_balance_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  functional_year_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  branch_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.TINYINT,
    allowNull: false,
    defaultValue: 1,
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: true,
  }
}, {
  tableName: 'accounting_ledgerinfo',
  timestamps: false,
});

LedgerInfo.belongsTo(BranchInfo, {
  foreignKey: "branch_id",
  targetKey: "branch_id",
  as: "branch",
});

LedgerInfo.belongsTo(AccountingLedgerGroup, {
  foreignKey: "master_ledger_group_id",
  targetKey: "id",
  as: "ledgerGroup",
});

LedgerInfo.belongsTo(AccountingLedgerSubGroup, {
  foreignKey: "ledger_sub_group_id",
  targetKey: "id",
  as: "ledgerSubGroup",
});


module.exports = LedgerInfo;
