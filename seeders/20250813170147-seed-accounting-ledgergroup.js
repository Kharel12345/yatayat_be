'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('accounting_ledgergroup', [
      { ledger_group_name: 'Account Payable', formula: 'credit-debit', is_editable: 0, status: 1, created_at: new Date() },
      { ledger_group_name: 'Account Receivable', formula: 'debit-credit', is_editable: 0, status: 1, created_at: new Date() },
      { ledger_group_name: 'Bank Account', formula: 'debit-credit', is_editable: 0, status: 1, created_at: new Date() },
      { ledger_group_name: 'Bank OCC Account', formula: 'credit-debit', is_editable: 0, status: 1, created_at: new Date() },
      { ledger_group_name: 'Bank OD Account', formula: 'credit-debit', is_editable: 0, status: 1, created_at: new Date() },
      { ledger_group_name: 'Capital A/c', formula: 'credit-debit', is_editable: 0, status: 1, created_at: new Date() },
      { ledger_group_name: 'Cash in Hand', formula: 'debit-credit', is_editable: 0, status: 1, created_at: new Date() },
      { ledger_group_name: 'Current Assets', formula: 'debit-credit', is_editable: 0, status: 1, created_at: new Date() },
      { ledger_group_name: 'Current Liabilities', formula: 'credit-debit', is_editable: 0, status: 1, created_at: new Date() },
      { ledger_group_name: 'Direct Expenses', formula: 'debit-credit', is_editable: 0, status: 1, created_at: new Date() },
      { ledger_group_name: 'Direct Income', formula: 'credit-debit', is_editable: 0, status: 1, created_at: new Date() },
      { ledger_group_name: 'Duties and Tax', formula: 'debit-credit', is_editable: 0, status: 1, created_at: new Date() },
      { ledger_group_name: 'Fix Assets', formula: 'debit-credit', is_editable: 0, status: 1, created_at: new Date() },
      { ledger_group_name: 'Indirect Expenses', formula: 'debit-credit', is_editable: 0, status: 1, created_at: new Date() },
      { ledger_group_name: 'Indirect Income', formula: 'credit-debit', is_editable: 0, status: 1, created_at: new Date() },
      { ledger_group_name: 'Investment', formula: 'debit-credit', is_editable: 0, status: 1, created_at: new Date() },
      { ledger_group_name: 'Loan and Advance', formula: 'debit-credit', is_editable: 0, status: 1, created_at: new Date() },
      { ledger_group_name: 'Loans', formula: 'credit-debit', is_editable: 0, status: 1, created_at: new Date() },
      { ledger_group_name: 'Provision', formula: 'credit-debit', is_editable: 0, status: 1, created_at: new Date() },
      { ledger_group_name: 'Purchase', formula: 'debit-credit', is_editable: 0, status: 1, created_at: new Date() },
      { ledger_group_name: 'Sales', formula: 'credit-debit', is_editable: 0, status: 1, created_at: new Date() },
      { ledger_group_name: 'Mics. Expenses (assets)', formula: 'debit-credit', is_editable: 0, status: 1, created_at: new Date() },
      { ledger_group_name: 'Reserve and surplus', formula: 'credit-debit', is_editable: 0, status: 1, created_at: new Date() },
      { ledger_group_name: 'Retained Earning', formula: 'credit-debit', is_editable: 0, status: 1, created_at: new Date() },
      { ledger_group_name: 'Stock In hand (closing stock)', formula: 'debit-credit', is_editable: 0, status: 1, created_at: new Date() },
      { ledger_group_name: 'Sundry Creditors', formula: 'credit-debit', is_editable: 0, status: 1, created_at: new Date() },
      { ledger_group_name: 'Sundry Debtors', formula: 'debit-credit', is_editable: 0, status: 1, created_at: new Date() },
      { ledger_group_name: 'Suspense a/c', formula: 'debit-credit', is_editable: 0, status: 1, created_at: new Date() },
      { ledger_group_name: 'Unsecured Loan', formula: 'credit-debit', is_editable: 0, status: 1, created_at: new Date() },
      { ledger_group_name: 'Stock In hand (opening Stock)', formula: 'debit-credit', is_editable: 0, status: 1, created_at: new Date() },
      { ledger_group_name: 'Secured Loan', formula: 'credit-debit', is_editable: 0, status: 1, created_at: new Date() },
      { ledger_group_name: 'Bonus Share', formula: 'debit-credit', is_editable: 0, status: 1, created_at: new Date() },
      { ledger_group_name: 'Short Term Loan', formula: 'credit-debit', is_editable: 0, status: 1, created_at: new Date() },
      { ledger_group_name: 'Share Capital', formula: 'credit-debit', is_editable: 0, status: 1, created_at: new Date() }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('accounting_ledgergroup', null, {});
  }
};
