'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('cash_invoice', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      vehicle_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Vehicles',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      bill_date: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      bill_date_bs: {
        type: Sequelize.STRING(244),
        allowNull: false,
      },
      payment_method: {
        type: Sequelize.ENUM('cash', 'online'),
        allowNull: false,
        defaultValue: 'cash',
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      remarks: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      branch_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      functional_year_id: {
        type: Sequelize.INTEGER,
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
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('cash_invoice');
  }
};
