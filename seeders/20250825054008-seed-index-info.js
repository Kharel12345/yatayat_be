'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('index_info', [
      {
        functional_year_id: 1, // Change as needed
        title: 'Receipt Number',
        index_code: 'receipt_no',
        max_id: 0,
        status: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        functional_year_id: 1,
        title: 'Transaction ID',
        index_code: 'transaction_id',
        max_id: 0,
        status: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        functional_year_id: 1,
        title: 'Sales Bill Number',
        index_code: 'sales_bill_number',
        max_id: 0,
        status: 1,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {
      ignoreDuplicates: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('index_info', {
      index_code: ['receipt_no', 'transaction_id', 'sales_bill_number']
    }, {});
  }
};
