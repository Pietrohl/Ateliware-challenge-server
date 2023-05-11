import { logger } from "../utils";

require("dotenv").config();

logger.info("Importing Configs");

const config = {
  PORT: 3000,
};

export { config };

