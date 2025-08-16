'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add status column
    await queryInterface.addColumn('Helpers', 'status', {
      type: Sequelize.TINYINT,   // 1 = active, 0 = inactive
      allowNull: false,
      defaultValue: 1
    });

    // Add createdBy column
    await queryInterface.addColumn('Helpers', 'createdBy', {
      type: Sequelize.INTEGER,   // optional, stores user ID
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove the columns if rollback
    await queryInterface.removeColumn('Helpers', 'status');
    await queryInterface.removeColumn('Helpers', 'createdBy');
  }
};
