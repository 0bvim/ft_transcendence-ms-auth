import pino from "pino";
import { config } from "./config";

const logger = pino({
  level: config.nodeEnv === "development" ? "debug" : "info",
  transport:
    config.nodeEnv === "development"
      ? {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "SYS:dd-mm-yyyy HH:MM:ss",
            ignore: "pid,hostname",
          },
        }
      : undefined,
});

export default logger;
