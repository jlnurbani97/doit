const winston = require('winston');
const path = require('path');
const fs = require('fs');

// Path assoluto alla cartella logs nella root del backend
const logDir = path.join(__dirname, '..', 'logs');

// Crea la cartella logs se non esiste
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// File log
const logFile = path.join(logDir, 'security.log');
console.log('LOGGER FILE PATH:', logFile); // DEBUG

const logger = winston.createLogger({
  level: 'info', // livello minimo del logger
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message, ip }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message} | IP: ${
        ip || 'N/A'
      }`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: logFile,
      level: 'info', // scrive info, warn e error
      handleExceptions: true,
    }),
  ],
});

// Log di test immediato per creare il file
logger.info('LOGGER INIZIALIZZATO - TEST');

module.exports = logger;
