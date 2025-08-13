'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('accounting_ledgergroup', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      ledger_group_name: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      formula: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      is_editable: {
        type: Sequelize.TINYINT,
        allowNull: false,
        defaultValue: 0
      },
      status: {
        type: Sequelize.TINYINT,
        allowNull: false,
        defaultValue: 1
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('accounting_ledgergroup');
  }
};
