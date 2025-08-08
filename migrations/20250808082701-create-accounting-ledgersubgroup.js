'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('accounting_ledgersub_group', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      sub_group_name: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      is_editable: {
        type: Sequelize.TINYINT,
        allowNull: false,
        defaultValue: 0
      },
      status: {
        type: Sequelize.TINYINT,
        allowNull: false,
        defaultValue: 1
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null,
        onUpdate: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

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
    await queryInterface.dropTable('accounting_ledgersub_group');
  }
};
