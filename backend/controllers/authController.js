const { registerUser, loginUser } = require('../services/authService.js');

//Metodo per gestione richiesta registrazione
const register = async (req, res, next) => {
  try {
    const { username, firstName, secondName, password } = req.body;
    const user = await registerUser(username, firstName, secondName, password);
    res.status(201).json({
      message: 'User registered',
      user: {
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        secondName: user.secondName,
      },
    });
  } catch (err) {
    next(err);
  }
};

//Metodo per gestione richiesta login
const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await loginUser(username, password);
    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        secondName: user.secondName,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login };
