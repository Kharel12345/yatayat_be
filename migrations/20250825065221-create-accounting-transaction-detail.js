'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('accounting_transaction_detail', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      comes_from: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      ledger_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      credit: {
        type: Sequelize.DOUBLE(50, 2),
        allowNull: false
      },
      debit: {
        type: Sequelize.DOUBLE(50, 2),
        allowNull: false
      },
      narration: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      particular: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      particular_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      table_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      transaction_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      voucher_date_ad: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      voucher_date_bs: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      voucher_number: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      voucher_type: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      functional_year_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      branch_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      status: {
        type: Sequelize.TINYINT,
        allowNull: false,
        defaultValue: 1
      },
      created_by: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null,
        onUpdate: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Add foreign key constraints
    await queryInterface.addConstraint('accounting_transaction_detail', {
      fields: ['ledger_id'],
      type: 'foreign key',
      name: 'fk_accounting_transaction_detail_ledger_id',
      references: {
        table: 'accounting_ledgerinfo',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    await queryInterface.addConstraint('accounting_transaction_detail', {
      fields: ['functional_year_id'],
      type: 'foreign key',
      name: 'fk_accounting_transaction_detail_functional_year',
      references: {
        table: 'functional_year',
        field: 'functional_year_id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    await queryInterface.addConstraint('accounting_transaction_detail', {
      fields: ['branch_id'],
      type: 'foreign key',
      name: 'fk_accounting_transaction_detail_branch',
      references: {
        table: 'branch_info',
        field: 'branch_id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    await queryInterface.addConstraint('accounting_transaction_detail', {
      fields: ['created_by'],
      type: 'foreign key',
      name: 'fk_accounting_transaction_detail_user',
      references: {
        table: 'user',
        field: 'user_id'
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('accounting_transaction_detail');
  }
};
