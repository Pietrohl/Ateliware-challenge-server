import type { AppContainer } from "../container";
import { redisClient } from "../db/redisClient.connection";
import {
  createRouteRepository,
  type DroneRouteRepository,
} from "./droneRoute.repository";
import type { Coordinate } from "./models/coordinate.model";

describe("DroneRoute Repository", () => {
  let repository: DroneRouteRepository;
  const coordinate: Coordinate = { x: "A1", y: 1 };
  const route = {
    deliveryCoordinate: coordinate,
    initialCoordinate: coordinate,
    packageCoordinate: coordinate,
    id: 12,
    path: [coordinate],
    time: 21312,
  };
  let list: { [key: string]: string[] };
  const mockContainer = {
    connection: {
      LPUSH: (key: string, item: string) => {
        list[key].push(item as never);
      },
      LTRIM: (key: string, start: number, end: number) => {
        list[key] = [...list[key].slice(start, end)] as string[];
      },
      LRANGE: (key: string, start: number, end: number) => {
        return list[key].slice(start, end);
      },
    } as unknown as typeof redisClient,
  } as AppContainer;

  beforeEach(() => {
    list = { route_list: [] };

    repository = createRouteRepository(mockContainer);
  });

  it("should be defined", () => {
    expect(repository).toBeDefined();
  });

  it("should return [] with empty repo", async () => {
    const routes = await repository.getRoutes(10);
    expect(routes).toMatchObject([]);
  });
  it("shoud add a route correctly", async () => {
    await repository.addRoute(route);
    const routes = await repository.getRoutes(10);

    expect(routes).toMatchObject([route]);
  });
});
