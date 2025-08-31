'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    
    // Add expire_date_bs column
    await queryInterface.addColumn('invoices', 'expire_date_bs', {
      type: Sequelize.STRING(20), // For storing expiry date in BS format
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove expire_date_bs column
    await queryInterface.removeColumn('invoices', 'expire_date_bs');

    // Remove invoice_date_bs column
    // await queryInterface.removeColumn('invoices', 'invoice_date_bs');
  }
};
