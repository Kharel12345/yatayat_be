'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('functional_year', {
      functional_year_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      functional_year: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      functional_year_start_ad: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      functional_year_start_bs: {
        type: Sequelize.STRING(45),
        allowNull: false,
      },
      functional_year_end_ad: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      functional_year_end_bs: {
        type: Sequelize.STRING(45),
        allowNull: false,
      },
      status: {
        type: Sequelize.TINYINT,
        defaultValue: 1,
      },
      created_by: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('functional_year');
  }
};
