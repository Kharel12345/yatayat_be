"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Vehicles", "billbookphoto", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("Vehicles", "subscriptiontype", {
      type: Sequelize.ENUM("monthly", "yearly", "both"),
      allowNull: false, 
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Vehicles", "billbookphoto");
    await queryInterface.removeColumn("Vehicles", "subscriptionType");
  },
};
