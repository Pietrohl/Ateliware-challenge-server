import { logger } from "../utils";

require("dotenv").config();

logger.info("importing configs...");

const config = {
  PORT: 3000,
};

export { config };

