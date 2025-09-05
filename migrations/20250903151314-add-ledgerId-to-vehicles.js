'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Vehicles', 'ledgerId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'LedgerInfo',
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
