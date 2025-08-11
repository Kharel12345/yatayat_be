'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('accounting_ledgerinfo', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      ledgername: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      ledger_type: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      master_ledger_group_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      ledger_sub_group_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      address: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      contact: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      opening_balance: {
        type: Sequelize.DOUBLE(50, 2),
        allowNull: true,
        defaultValue: 0.00,
      },
      opening_balance_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      functional_year_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      branch_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      status: {
        type: Sequelize.TINYINT,
        allowNull: false,
        defaultValue: 1,
      },
      created_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null,
        onUpdate: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    // Add foreign key constraints after table creation
    await queryInterface.addConstraint('accounting_ledgerinfo', {
      fields: ['branch_id'],
      type: 'foreign key',
      name: 'fk_accounting_ledgerinfo_branch',
      references: {
        table: 'branch_info',
        field: 'branch_id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addConstraint('accounting_ledgerinfo', {
      fields: ['functional_year_id'],
      type: 'foreign key',
      name: 'fk_accounting_ledgerinfo_functional_year',
      references: {
        table: 'functional_year',
        field: 'functional_year_id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addConstraint('accounting_ledgerinfo', {
      fields: ['ledger_sub_group_id'],
      type: 'foreign key',
      name: 'fk_accounting_ledgerinfo_ledger_sub_group_id',
      references: {
        table: 'accounting_ledgersub_group',
        field: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addConstraint('accounting_ledgerinfo', {
      fields: ['master_ledger_group_id'],
      type: 'foreign key',
      name: 'fk_accounting_ledgerinfo_master_ledger_group_id',
      references: {
        table: 'accounting_ledgergroup',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addConstraint('accounting_ledgerinfo', {
      fields: ['created_by'],
      type: 'foreign key',
      name: 'fk_accounting_ledgerinfo_user',
      references: {
        table: 'user',
        field: 'user_id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('accounting_ledgerinfo');
  }
};
