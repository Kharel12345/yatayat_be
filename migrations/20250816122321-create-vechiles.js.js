'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Vehicles', 'licensePaper', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('Vehicles', 'insurancePaper', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Vehicles', 'licensePaper');
    await queryInterface.removeColumn('Vehicles', 'insurancePaper');
  }
};
