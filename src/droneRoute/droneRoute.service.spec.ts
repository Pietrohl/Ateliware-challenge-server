import type { AppContainer } from "src/container";
import {
  createDroneRouteService,
  type DroneRouteService,
} from "./droneRoute.service";
import type { Coordinate } from "./models/coordinate.model";
import type { DroneRoute } from "./models/droneRoute.model";

describe("droneRouteService", () => {
  let droneRouteService: DroneRouteService;
  const coordinate: Coordinate = { xAxis: "A1", yAxis: 1 };
  const mockRoute: DroneRoute = {
    id: 1,
    deliveryCoordinate: coordinate,
    initialCoordinate: coordinate,
    packageCoordinate: coordinate,
    path: [coordinate],
    time: 1000,
  };
  const mockDroneList: DroneRoute[] = Array(10).fill(mockRoute);
  const mockContainer: AppContainer = {} as AppContainer;

  beforeEach(() => {
    droneRouteService = createDroneRouteService(mockContainer);
  });

  it("should be defined", () => {
    expect(droneRouteService).toBeDefined();
  });

  it("should corectly list the past calculated routes", () => {
    expect(droneRouteService.listLastCalculatedRoutes().length).toEqual(10);
    expect(droneRouteService.listLastCalculatedRoutes()).toMatchObject(
      mockDroneList
    );
  });
});
