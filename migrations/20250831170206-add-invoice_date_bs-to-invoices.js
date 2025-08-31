'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('invoices', 'invoice_date_bs', {
      type: Sequelize.STRING(20), // Using STRING for BS date like "2082-05-15"
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('invoices', 'invoice_date_bs');
  }
};
