'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('accounting_ledgersub_group', [
      { sub_group_name: 'Carriage inward expenses', is_editable: 0, status: 1, created_at: new Date() },
      { sub_group_name: 'Manufacturing expenses', is_editable: 0, status: 1, created_at: new Date() },
      { sub_group_name: 'Administrative expenses', is_editable: 0, status: 1, created_at: new Date() },
      { sub_group_name: 'Selling & distributions expenses', is_editable: 0, status: 1, created_at: new Date() },
      { sub_group_name: 'Financial expenses', is_editable: 0, status: 1, created_at: new Date() },
      { sub_group_name: 'Non- operating income', is_editable: 0, status: 1, created_at: new Date() },
      { sub_group_name: 'Preliminary expenses', is_editable: 0, status: 1, created_at: new Date() },
      { sub_group_name: 'Interest Paid', is_editable: 0, status: 1, created_at: new Date() }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('accounting_ledgersub_group', null, {});
  }
};
