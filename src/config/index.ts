import { config as dotenvConfig } from "dotenv";
import { logger } from "../utils";

dotenvConfig();

logger.info("importing configs...");

const config = {
  PORT: 3000,
};

export { config };
