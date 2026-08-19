'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Helpers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      helperName: Sequelize.STRING,
      address: Sequelize.STRING,
      registrationNumber: Sequelize.STRING,
      panNo: Sequelize.STRING,
      photo: Sequelize.STRING,
      vehicleId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Vehicles',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('Helpers');
  }
};
