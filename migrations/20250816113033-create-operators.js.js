'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add status column
    await queryInterface.addColumn('Operators', 'status', {
      type: Sequelize.TINYINT,   // 1 = active, 0 = inactive
      allowNull: false,
      defaultValue: 1
    });

    // Add createdBy column
    await queryInterface.addColumn('Operators', 'createdBy', {
      type: Sequelize.INTEGER,   // optional, stores user ID
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove columns on rollback
    await queryInterface.removeColumn('Operators', 'status');
    await queryInterface.removeColumn('Operators', 'createdBy');
  }
};
