import { config as dotenvConfig } from "dotenv";
import { logger } from "../utils";

dotenvConfig();

logger.info("importing configs...");

const config = {
  PORT: Number(process.env.PORT) ?? 3000,
  PUBLIC_FOLDER: process.env.PUBLIC_FOLDER,
  REDIS_URL: process.env.REDIS_URL,
};

export { config };
