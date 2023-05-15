import type { AppContainer } from "../container";
import { logger } from "../utils";
import type { DroneRoute } from "./models/droneRoute.model";

export interface DroneRouteService {
  listLastCalculatedRoutes: () => Promise<DroneRoute[]>;
  // calculateNewRoute: (
  //   dronePosition: string,
  //   packagePosition: string,
  //   deliveryPosition: string
  // ) => Promise<DroneRoute>;
}

export const createDroneRouteService = ({
  droneRouteRepository,
}: AppContainer): DroneRouteService => {
  logger.info("initiating drone route service...");

  return {
    listLastCalculatedRoutes: async () => {
      return droneRouteRepository.getRoutes(10);
    },
    // calculateNewRoute: () => {

    // }
  };
};
