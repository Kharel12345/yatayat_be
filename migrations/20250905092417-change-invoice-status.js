'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Change status column
    await queryInterface.changeColumn('invoices', 'status', {
      type: Sequelize.TINYINT,
      allowNull: false,
      defaultValue: 1, // 1 = Active
    });
  },

  async down(queryInterface, Sequelize) {
    // 1. Revert status column back to ENUM
    await queryInterface.changeColumn('invoices', 'status', {
      type: Sequelize.ENUM('pending', 'paid', 'overdue', 'cancelled'),
      allowNull: false,
      defaultValue: 'pending',
    });

    // 2. Remove bank_id column
    await queryInterface.removeColumn('invoices');
  },
};
