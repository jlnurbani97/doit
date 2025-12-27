'use strict';
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword1 = await bcrypt.hash('test_password!', 10);
    const hashedPassword2 = await bcrypt.hash('paolino_password', 10);
    const hashedPassword3 = await bcrypt.hash('sarayeah_password', 10);

    // Inserimento Stati
    await queryInterface.bulkInsert('States', [
      { name: 'To Do' },
      { name: 'In Progress' },
      { name: 'Done' },
    ]);

    // Inserimento Utenti
    await queryInterface.bulkInsert('Users', [
      {
        username: 'test',
        password: hashedPassword1,
        firstName: 'test',
        secondName: 'test',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'paolino',
        password: hashedPassword2,
        firstName: 'Paolo',
        secondName: 'Rossi',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'sarayeah',
        password: hashedPassword3,
        firstName: 'Sara',
        secondName: 'Verdi',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    // Recupero ID
    const [stateRows] = await queryInterface.sequelize.query(
      'SELECT id, name FROM States;'
    );
    const [userRows] = await queryInterface.sequelize.query(
      'SELECT id, username FROM Users;'
    );

    const stateMap = Object.fromEntries(stateRows.map((s) => [s.name, s.id]));
    const userMap = Object.fromEntries(userRows.map((u) => [u.username, u.id]));

    // Inserimento 3 Todo
    const todos = [];
    const usernames = ['test', 'paolino', 'sarayeah'];
    const stateNames = ['To Do', 'In Progress', 'Done'];

    usernames.forEach((uname) => {
      stateNames.forEach((sname, index) => {
        todos.push({
          title: `Task ${index + 1} per ${uname}`,
          description: `Descrizione del task in stato ${sname}`,
          userId: userMap[uname],
          stateId: stateMap[sname],
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });
    });

    await queryInterface.bulkInsert('Todos', todos);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Todos', null, {});
    await queryInterface.bulkDelete('Users', null, {});
    await queryInterface.bulkDelete('States', null, {});
  },
};
