"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable("Vehicles");

    // Add routePermit only if it doesn't exist
    if (!tableInfo.routePermit) {
      await queryInterface.addColumn("Vehicles", "routePermit", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }

    // Add jachPass only if it doesn't exist
    if (!tableInfo.jachPass) {
      await queryInterface.addColumn("Vehicles", "jachPass", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable("Vehicles");

    // Remove routePermit if it exists
    if (tableInfo.routePermit) {
      await queryInterface.removeColumn("Vehicles", "routePermit");
    }

    // Remove jachPass if it exists
    if (tableInfo.jachPass) {
      await queryInterface.removeColumn("Vehicles", "jachPass");
    }
  },
};
