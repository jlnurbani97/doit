const ApiError = require('../utils/ApiError');

const errorHandler = (err, req, res, next) => {
  console.error('[ERROR]:', err);

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      error: err.message,
    });
  }
  return res.status(500).json({
    error: 'Internal Server Error',
  });
};

module.exports = errorHandler;
