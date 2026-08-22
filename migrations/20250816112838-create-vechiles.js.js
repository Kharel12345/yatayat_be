'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Vehicles', 'status', {
      type: Sequelize.TINYINT,   // 1 = active, 0 = inactive
      allowNull: false,
      defaultValue: 1,
    });

    await queryInterface.addColumn('Vehicles', 'createdBy', {
      type: Sequelize.INTEGER,   // assuming this references a User ID
      allowNull: true,
    });

    await queryInterface.addColumn('Vehicles', 'categoryId', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    await queryInterface.addColumn('Vehicles', 'subCategoryId', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    await queryInterface.addColumn('Vehicles', 'branchId', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    await queryInterface.addColumn('Vehicles', 'organization', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('Vehicles', 'functionalYear', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('Vehicles', 'status');
    await queryInterface.removeColumn('Vehicles', 'createdBy');
    await queryInterface.removeColumn('Vehicles', 'categoryId');
    await queryInterface.removeColumn('Vehicles', 'subCategoryId');
    await queryInterface.removeColumn('Vehicles', 'branchId');
    await queryInterface.removeColumn('Vehicles', 'organization');
    await queryInterface.removeColumn('Vehicles', 'functionalYear');
  }
};
