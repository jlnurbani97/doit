const { where } = require('sequelize');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '../.env.backend' });

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

//Metodo per il login utente
const loginUser = async (username, password) => {
  //

  const loggedUser = await User.findOne({ where: { username } });

  if (!loggedUser) throw new ApiError('Credenziali Errate', 404);

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

module.exports = { registerUser, loginUser };
