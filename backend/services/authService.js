const { where } = require('sequelize');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '../.env.backend' });
const { sequelize } = require('../models');

//Metodo per la registrazione utente
const registerUser = async (username, firstName, secondName, password) => {
  //validazione e hashing in futuro

  const existingUser = await User.findOne({ where: { username } });
  if (existingUser) throw new ApiError('Utente già esistente!', 409);

  const newUser = await User.create({
    username: username,
    firstName: firstName,
    secondName: secondName,
    password: password,
  });

  return newUser;
};

//Metodo per il login utente corretto
const loginUser = async (username, password) => {
  //

  const loggedUser = await User.findOne({ where: { username } });
  //Lancio comunque 401 per non svelare info
  if (!loggedUser) throw new ApiError('Credenziali Errate', 401);
  if (loggedUser.password !== password) {
    throw new ApiError('Credenziali Errate', 401);
  }
  const token = jwt.sign(
    { userId: loggedUser.id, username: loggedUser.username },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  return { loggedUser, token };
};

//Metodo per login unsafe per dimostrazione SQLi utilizzando interpolazione di stringhe
// invece che metodi ORM di Sequelize
/*const loginUserUnsafe = async (username, password) => {
  const query = `SELECT * FROM Users WHERE username = '${username}' AND password = '${password}' LIMIT 1`;
  const [results] = await sequelize.query(query);
  if (results.length === 0) {
    throw new ApiError('Credenziali errate', 401);
  }
  return results[0];
};*/

module.exports = { registerUser, loginUser };
