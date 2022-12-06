import winston from "winston"

const logger = winston.createLogger({
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({ level: "info" }),
    new winston.transports.File({ filename: "warn.log", level: "warn" }),
  ],
});

const errorLogger = winston.createLogger({
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({ level: "error" }),
    new winston.transports.File({ filename: "error.log", level: "error" }),
  ],
});

export { logger, errorLogger };
