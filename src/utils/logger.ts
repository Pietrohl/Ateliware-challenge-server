import winston from "winston";
import { isDevelopment } from "./isDevelopment";

const logLevel = isDevelopment() ? "debug" : "error";

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6,
};

const transports = [
  new winston.transports.Console(),
  //  ,new winston.transports.Http({ host:"", port:"" , level: 'error' }) // Could add a splunk log here
];

const format = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

export const logger = winston.createLogger({
  level: logLevel,
  levels,
  format,
  transports,
});
