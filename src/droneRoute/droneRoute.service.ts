import type { AppContainer } from "../container";
import { logger } from "../utils";
import { PlanarGraph, calcRoute } from "./A_star.service";
import type { Coordinate } from "./models/coordinate.model";
import type { DroneRoute } from "./models/droneRoute.model";

export interface DroneRouteService {
  listLastCalculatedRoutes: () => Promise<DroneRoute[]>;
  calculateNewRoute: (
    initialCoordinate: Coordinate,
    packageCoordinate: Coordinate,
    deliveryCoordinate: Coordinate
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
      initialCoordinate,
      packageCoordinate,
      deliveryCoordinate
    ) => {
      const board = await chessboardRepository.getBoard();

      const graph = new PlanarGraph(board);

      const initialCoordinateKey = `${initialCoordinate.x}${initialCoordinate.y}`;
      const packageCoordinateKey = `${packageCoordinate.x}${packageCoordinate.y}`;
      const a = calcRoute({
        graph,
        startKey: initialCoordinateKey,
        endKey: packageCoordinateKey,
      });

      const deliveryCoordinateKey = `${deliveryCoordinate.x}${deliveryCoordinate.y}`;
      const b = calcRoute({
        graph,
        startKey: packageCoordinateKey,
        endKey: deliveryCoordinateKey,
      });

      if (!a || !b) throw new Error();

      const route = {
        id: 6534323,
        time: a?.cost + b?.cost,
        initialCoordinate,
        packageCoordinate,
        deliveryCoordinate,
        path: a.path.slice(0, -1).concat(b.path),
      };

      const status = await droneRouteRepository.addRoute(route);

      if (!status) throw new Error("Unable to add new route");

      return route;
    },
  };
};
