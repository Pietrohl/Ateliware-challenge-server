import type { AppContainer } from "../container";
import { logger } from "../utils";
import { calcRoute } from "./A_star.service";
import type { Coordinate } from "./models/coordinate.model";
import type { DroneRoute } from "./models/droneRoute.model";

export interface DroneRouteService {
  listLastCalculatedRoutes: () => Promise<DroneRoute[]>;
  calculateNewRoute: (
    dronePosition: Coordinate,
    packagePosition: Coordinate,
    deliveryPosition: Coordinate
  ) => Promise<DroneRoute>;
}

export const createDroneRouteService = ({
  chessboardRepository,
  droneRouteRepository,
}: AppContainer): DroneRouteService => {
  logger.info("initiating drone route service...");

 

 

  return {
    listLastCalculatedRoutes: async () => {
      return droneRouteRepository.getRoutes(10);
    },
    calculateNewRoute: async (
      dronePosition,
      packagePosition,
      deliveryPosition
    ) => {
      const board = await chessboardRepository.getBoard();

      const a = calcRoute(board, dronePosition, packagePosition);
      const b = calcRoute(board, packagePosition, deliveryPosition);
    },
  };
};
