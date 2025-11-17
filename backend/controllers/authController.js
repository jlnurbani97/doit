const { registerUser } = require('../services/authService.js');

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
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { register };
