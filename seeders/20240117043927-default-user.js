'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    // await queryInterface.bulkInsert('user', [{
    //   username: 'admin',
    //   email: 'admin@admin.com',
    //   password: '$2y$10$WGCyK6Abg3bWSiFKpU6e1u5ts52yBiKGsPeTUEUHFOs2dNYq7tGKu'
    // }], {});
      await queryInterface.bulkInsert('user', [{
      username: 'admin',
      password: '$2y$10$WGCyK6Abg3bWSiFKpU6e1u5ts52yBiKGsPeTUEUHFOs2dNYq7tGKu',
      name: 'Administrator',
      status: 1,
      user_type: 'admin',
      created_by: null,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('user', null, {});
  }
};
