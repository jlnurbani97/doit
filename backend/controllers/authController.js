const { registerUser, loginUser } = require('../services/authService.js');
const logger = require('../utils/Logger.js');

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
  //TODO: Da riprovare con client non su localhost
  const IP =
    req.headers['x-forwarded-for'] ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    req.connection?.socket?.remoteAddress ||
    'IP_NOT_FOUND';

  //Temp degug log
  console.log('Debug IP headers:', req.headers['x-forwarded-for']);
  console.log('Debug IP socket:', req.socket?.remoteAddress);
  console.log('IP finale assegnato:', IP);
  try {
    const { username, password } = req.body;

    const user = await loginUser(username, password);

    logger.info({ message: `Login successful: ${username}`, ip: IP });
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
    if (err.statusCode === 401 || err.statusCode === 404) {
      logger.warn({
        message: `Tentativo di login fallito | User: ${req.body.username}`,
        ip: IP,
      });
    }
    next(err);
  }
};

module.exports = { register, login };
