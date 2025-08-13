'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('label_info', [
      { label_name: 'monthly', status: 1 },
      { label_name: 'yearly', status: 1 },
      { label_name: 'both', status: 1 },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('label_info', null, {});
  }
};
