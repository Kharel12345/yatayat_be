'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('receipt', 'bill_title', {
      type: Sequelize.STRING(255),
      allowNull: false,
      defaultValue: '',
    });
    await queryInterface.addColumn('receipt', 'vehicle_no', {
      type: Sequelize.STRING(255),
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('receipt', 'vehicle_no');
    await queryInterface.removeColumn('receipt', 'bill_title');
  }
};
