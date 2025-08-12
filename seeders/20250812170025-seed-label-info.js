'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('label_info', [
      { label_name: 'Label 1', status: 1 },
      { label_name: 'Label 2', status: 1 },
      { label_name: 'Label 3', status: 1 },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('label_info', null, {});
  }
};
