const { registerUser, loginUser } = require('../services/authService.js');

//Metodo per gestione richiesta registrazione
const register = async (req, res) => {
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
    console.log('[REGISTRATION SUCCESSFUL]: ', user.username, user.id);
  } catch (error) {
    console.error(
      `[REGISTRATION FAILED]: Message: ${error.message} Status: ${error.status}`
    );
    res.status(error.status || 500).json({ error: error.message });
  }
};

//Metodo per gestione richiesta login
const login = async (req, res) => {
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
    console.log('[LOGIN SUCCESSFUL]: ', user.username, user.id);
  } catch (error) {
    console.error(
      `[LOGIN FAILED]: Message: ${error.message} Status: ${error.status}`
    );
    res.status(401).json({ error: 'Credenziali non valide' });
  }
};

module.exports = { register, login };
