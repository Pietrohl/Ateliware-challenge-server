import type { AppContainer } from "src/container";
import { logger } from "../utils";
import type { DroneRoute } from "./models/droneRoute.model";

export type DroneRouteRepository = {
  addRoute: (route: DroneRoute) => Promise<boolean>;
  getRoutes: (range: number) => Promise<DroneRoute[]>;
};

export const createRouteRepository = ({
  connection,
}: AppContainer): DroneRouteRepository => {
  logger.info("initiating drone route repository...");

  return {
    addRoute: async (route: DroneRoute) => {
      const newItem = JSON.stringify(route);
      try {
        await connection.LPUSH("route_list", newItem);
        await connection.LTRIM("route_list", 0, 9);
        return true;
      } catch (err) {
        logger.error(err);
        return false;
      }
    },
    getRoutes: async (range: number = 10) => {
      try {
        const routes = await connection.LRANGE(
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
