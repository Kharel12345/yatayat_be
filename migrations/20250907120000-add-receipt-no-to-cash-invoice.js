'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('cash_invoice', 'receipt_no', {
      type: Sequelize.STRING(255),
      allowNull: true,
      after: 'bill_date_bs'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('cash_invoice', 'receipt_no');
  }
};