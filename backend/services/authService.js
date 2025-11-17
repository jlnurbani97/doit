const { where } = require('sequelize');
const { User } = require('../models');

//Metodo per la registrazione utente
const registerUser = async (username, firstName, secondName, password) => {
  //validazione e hashing in futuro

  const existingUser = await User.findOne({ where: { username } });
  if (existingUser) {
    const error = new Error('Username already exists');
    error.status = 409;
    throw error;
  }

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

  if (!loggedUser) {
    const error = new Error('User not found');
    error.status = 404;
    throw error;
  }
  if (loggedUser.password !== password) {
    const error = new Error('Incorrect password');
    error.status = 401;
    throw error;
  }
  return loggedUser;
};

module.exports = { registerUser, loginUser };
