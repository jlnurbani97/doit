require('dotenv').config({ path: './.env.backend' });

//Configurazione .env dev
module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PW,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
  },
  //TODO: Configurazione .env Prod
};
