import type { AppContainer } from "src/container";
import {
  createDroneRouteController,
  type RoutingController,
} from "./droneRoute.controller";
import type { DroneRouteService } from "./droneRoute.service";
import type { Coordinate } from "./models/coordinate.model";
import type { DroneRoute } from "./models/droneRoute.model";

describe("droneRouteController", () => {
  let controller: RoutingController;
  const coordinate: Coordinate = { x: "A1", y: 1 };
  const mockRoute: DroneRoute = {
    deliveryCoordinate: coordinate,
    initialCoordinate: coordinate,
    packageCoordinate: coordinate,
    path: [coordinate],
    time: 1000,
  };
  const routingService: DroneRouteService = {
    listLastCalculatedRoutes: async () =>
      Promise.resolve([mockRoute, mockRoute, mockRoute]),
    calculateNewRoute: async () => Promise.resolve(mockRoute),
  };

  const mockContainer: AppContainer = {
    droneRouteService: routingService,
  } as AppContainer;

  beforeEach(() => {
    controller = createDroneRouteController(mockContainer);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
