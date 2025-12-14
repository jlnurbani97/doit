'use strict';
//Bulk per riempimento tabella States

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('States', [
      { name: 'To do' },
      { name: 'In progress' },
      { name: 'Done' },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('States', null, {});
  },
};
