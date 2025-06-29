import winston from "winston";

const isDev = process.env.NODE_ENV !== "production";

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }), // show stack in logs
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({
      filename: "logs/app.log",
      handleExceptions: true,
    }),
  ],
  exitOnError: false, // Do not exit on handled exceptions
});

// Log to console only in dev
if (isDev) {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  );
}

export default logger;
