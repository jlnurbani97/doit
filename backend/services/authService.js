const { User } = require('../models');

//Metodo per la registrazione utente
const registerUser = async (username, firstName, secondName, password) => {
  //validazione e hashing in futuro

  const newUser = await User.create({
    username: username,
    firstName: firstName,
    secondName: secondName,
    password: password,
  });

  return newUser;
};

module.exports = { registerUser };
