'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('accounting_ledgersub_group', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      sub_group_name: {
        type: Sequelize.STRING(255),
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
        defaultValue: null,
        onUpdate: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('accounting_ledgersub_group');
  }
};
