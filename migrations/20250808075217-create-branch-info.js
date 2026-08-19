'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('branch_info', {
      branch_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      status: {
        type: Sequelize.INTEGER,
        allowNull: true 
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('branch_info');
  }
};
