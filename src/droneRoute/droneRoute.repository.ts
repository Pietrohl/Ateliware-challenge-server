import { redisClient } from "../db/redisClient.connection";
import { logger } from "../utils";
import type { DroneRoute } from "./models/droneRoute.model";

export type DroneRouteRepository = {
  addRoute: (route: DroneRoute) => Promise<boolean>;
  getRoutes: (range: number) => Promise<DroneRoute[]>;
};

export const createRouteRepository = async (): Promise<DroneRouteRepository> => {
  await redisClient.connect();

  return {
    addRoute: async (route: DroneRoute) => {
      const newItem = JSON.stringify(route);
      try {
        await redisClient.LPUSH("route_list", newItem);
        await redisClient.LTRIM("route_list", 0, 9);
        return true;
      } catch (err) {
        logger.error(err);
        return false;
      }
    },
    getRoutes: async (range: number = 10) => {
      debugger
      try {
        const routes = await redisClient.LRANGE(
          "route_list",
          0,
          Math.min(range - 1, 9)
        );
        return routes.map((item) => JSON.parse(item));
      } catch (err) {
        logger.error(err);
        return [];
      }
    },
  };
};
