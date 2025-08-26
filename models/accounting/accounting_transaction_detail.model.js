'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class AccountingTransactionDetail extends Model {
    static associate(models) {
      // Ledger info
      AccountingTransactionDetail.belongsTo(models.AccountingLedgerinfo, {
        foreignKey: 'ledger_id',
        as: 'ledger'
      });

      // Functional year
      AccountingTransactionDetail.belongsTo(models.FunctionalYear, {
        foreignKey: 'functional_year_id',
        as: 'functionalYear'
      });

      // Branch info
      AccountingTransactionDetail.belongsTo(models.BranchInfo, {
        foreignKey: 'branch_id',
        as: 'branch'
      });

      // Created by user
      AccountingTransactionDetail.belongsTo(models.User, {
        foreignKey: 'created_by',
        as: 'creator'
      });
    }
  }

  AccountingTransactionDetail.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      comes_from: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      ledger_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      credit: {
        type: DataTypes.DOUBLE(50, 2),
        allowNull: false
      },
      debit: {
        type: DataTypes.DOUBLE(50, 2),
        allowNull: false
      },
      narration: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      particular: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      particular_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      table_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      transaction_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      voucher_date_ad: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      voucher_date_bs: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      voucher_number: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      voucher_type: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      functional_year_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      branch_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      status: {
        type: DataTypes.TINYINT,
        defaultValue: 1
      },
      created_by: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      updated_at: {
        type: DataTypes.DATE
      }
    },
    {
      sequelize,
      modelName: 'AccountingTransactionDetail',
      tableName: 'accounting_transaction_detail',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  );

  return AccountingTransactionDetail;
};
