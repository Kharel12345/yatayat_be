'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('label_info', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      label_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      status: {
        type: Sequelize.TINYINT,
        allowNull: false,
        defaultValue: 1,
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('label_info');
  }
};
