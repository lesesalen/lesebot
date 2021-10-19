import winston, { format, transports } from "winston";

const logger = winston.createLogger({
  level: "info",
  format: format.combine(format.timestamp(), format.errors({ stack: true }), format.splat(), format.json()),
  defaultMeta: { service: "lesebot" },
  transports: [
    new transports.Console(),
    new transports.File({ filename: "error.log", level: "error" }),
    new transports.File({ filename: "combined.log" }),
  ],
});

// eslint-disable-next-line import/no-default-export
export default logger;
