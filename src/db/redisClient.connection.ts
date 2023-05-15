import { createClient } from "redis";
import { logger } from "../utils";

const redisClient = createClient();
redisClient.on("error", (err) => logger.error("Redis Client Error ", err));

export { redisClient };
