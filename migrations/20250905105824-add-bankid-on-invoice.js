'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add bank_id column
    await queryInterface.addColumn('invoices', 'bank_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'accounting_ledgerinfo',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove bank_id column
    await queryInterface.removeColumn('invoices', 'bank_id');
  },
};
