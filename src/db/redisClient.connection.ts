import { createClient } from "redis";
import { config } from "../config";
import { logger } from "../utils";

const redisClient = createClient({
  url: config.REDIS_URL,
});
redisClient.on("error", (err) => logger.error("Redis Client Error ", err));

export { redisClient };
