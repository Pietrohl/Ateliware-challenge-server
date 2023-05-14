import type { AppContainer } from "../container";
import type { DroneRoute } from "./models/droneRoute.model";

export interface DroneRouteService {
  listLastCalculatedRoutes: () => Promise<DroneRoute[]>;
  // calculateNewRoute: (
  //   dronePosition: string,
  //   packagePosition: string,
  //   deliveryPosition: string
  // ) => DroneRoute;
}

export const createDroneRouteService = ({
  droneRouteRepository,
}: AppContainer): DroneRouteService => {
  return {
    listLastCalculatedRoutes: () => {
      return droneRouteRepository.getRoutes(10);
    },
  };
};
