'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('sms_setting_info', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      api_url: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      api_key: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      sender_id: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
      route_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      campaign_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      created_by: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      created_in: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('sms_setting_info');
  }
};
