import type { Express } from "express";
import { config } from "./config";
import { createServer } from "./server";
import { logger } from "./utils";

async function bootstrap(app: Promise<Express>) {
  try {
    (await app).listen(config.PORT, "0.0.0.0", () => {
      logger.info(`running on port: ${config.PORT}`);
    });
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
}

void bootstrap(createServer());
