// migrations/XXXXXXXXXXXXXX-add-show-in-billing-to-billing-title-info.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('billing_title_info', 'show_in_billing', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('billing_title_infos', 'show_in_billing');
  },
};