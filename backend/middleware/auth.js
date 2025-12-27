const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '../.env.backend' });

module.exports = (req, res, next) => {
  try {
    //Prendo la parte valida del token (non Bearer)
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.userData = { userId: decodedToken.userId };
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Autenticazione fallita!' });
  }
};
