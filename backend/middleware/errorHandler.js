const ApiError = require('../utils/ApiError');

//Middleware per gestione migliore errori
const errorHandler = (err, req, res, next) => {
  console.error('[ERROR]:', err);

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      error: err.message,
    });
  }
  //Comportamento di default
  return res.status(500).json({
    error: 'Errore interno al server',
  });
};

module.exports = errorHandler;
