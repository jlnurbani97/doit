const winston = require('winston');
const path = require('path');

//Formato del logger per facilitare poi lettura python/bash
const logformat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ip }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${message} | IP: ${
      ip || 'N/A'
    }`;
  })
);

//Creazione logger
const logger = winston.createLogger({
  level: 'info',
  format: logformat,
  transports: [
    new winston.transports.Console(),
    //File di salvataggio
    new winston.transports.File({
      filename: '/app/logs/security.log',
      level: 'warn',
    }),
  ],
});

module.exports = logger;
