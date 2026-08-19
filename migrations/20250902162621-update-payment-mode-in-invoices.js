module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('invoices', 'payment_mode', {
      type: Sequelize.ENUM('cash', 'card', 'bank_transfer', 'online', 'credit'),
      allowNull: true,
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('invoices', 'payment_mode', {
      type: Sequelize.ENUM('cash', 'card', 'bank_transfer', 'online', 'cheque'),
      allowNull: true,
    });
  }
};
