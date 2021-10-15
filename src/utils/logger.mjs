import winston, { format, transports } from "winston";

const logger = winston.createLogger({
  level: "info",
  format: format.combine(format.timestamp(), format.errors({ stack: true }), format.splat(), format.json()),
  defaultMeta: { service: "lesebot" },
  transports: [
    new transports.File({ filename: "error.log", level: "error" }),
    new transports.File({ filename: "combined.log" }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    }),
  );
}

export default logger;
