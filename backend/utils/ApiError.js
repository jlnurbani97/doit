class ApiError extends Error {
  //Costruttore Errore personalizzato
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}

module.exports = ApiError;
