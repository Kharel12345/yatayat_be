'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('accounting_ledger_mapping', [
      { id: 1, label: 'Purchase Ledger', ledger_id: 0 },
      { id: 2, label: 'Stock Ledger', ledger_id: 0 },
      { id: 3, label: 'Opening Stock', ledger_id: 0 },
      { id: 4, label: 'Cash In Hand', ledger_id: 0 },
      { id: 5, label: 'Bad Debt', ledger_id: 0 },
      { id: 6, label: 'Bad Debt Reserve', ledger_id: 0 },
      { id: 7, label: 'Provision For Discount', ledger_id: 0 },
      { id: 8, label: 'Discount', ledger_id: 0 },
      { id: 9, label: 'Short Term Bank Loan', ledger_id: 0 },
      { id: 10, label: 'Wages', ledger_id: 0 },
      { id: 11, label: 'Liabilities', ledger_id: 0 },
      { id: 12, label: 'Dividend Paid', ledger_id: 0 },
      { id: 13, label: 'Interest Received', ledger_id: 0 },
      { id: 14, label: 'Dividend Received', ledger_id: 0 },
      { id: 15, label: 'Retained Earning', ledger_id: 0 },
      { id: 16, label: 'Milk Purchase Transportation A/C', ledger_id: 0 },
      { id: 17, label: 'Milk Purchase Stock A/C', ledger_id: 0 },
      { id: 18, label: 'Sales Ledger', ledger_id: 0 },
      { id: 19, label: 'Sales Commission A/C', ledger_id: 0 },
      { id: 20, label: 'Damage Goods A/C', ledger_id: 0 },
      { id: 21, label: 'Vat Payable', ledger_id: 0 }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('accounting_ledger_mapping', null, {});
  }
};
