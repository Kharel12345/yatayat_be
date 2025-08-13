'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('accounting_ledger_mapping', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      label: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      ledger_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('accounting_ledger_mapping');
  }
};
