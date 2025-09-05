'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Vehicles', 'ledgerId', {
      type: Sequelize.INTEGER,
      allowNull: true,  // or true, depending on your requirement
      references: {
        model: 'accounting_ledgerinfo', // 👈 must match tableName in LedgerInfo model
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Vehicles', 'ledgerId');
  }
};
