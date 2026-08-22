"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      "billing_title_info",
      "billing_title_english",
      {
        type: Sequelize.TEXT,
        allowNull: true,
        after: "billing_title",
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn(
      "billing_title_info",
      "billing_title_english"
    );
  },
};