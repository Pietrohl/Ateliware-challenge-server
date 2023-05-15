import type { AppContainer } from "../container";
import { redisClient } from "../db/redisClient.connection";
import {
  createRouteRepository,
  type DroneRouteRepository,
} from "./droneRoute.repository";
import type { Coordinate } from "./models/coordinate.model";

describe("DroneRoute Repository", () => {
  let repository: DroneRouteRepository;
  const coordinate: Coordinate = { xAxis: "A1", yAxis: 1 };
  const route = {
    deliveryCoordinate: coordinate,
    initialCoordinate: coordinate,
    packageCoordinate: coordinate,
    id: 12,
    path: [coordinate],
    time: 21312,
  }
  let list: { [key: string]: string[] };
  let mockContainer = {
    connection: {
      LPUSH: (key, item) => {
        list[key as string].push(item as never);
      },
      LTRIM: (key, start, end) => {
        list[key as string] = [
          ...list[key as string].slice(start as number, end as number),
        ] as string[];
      },
      LRANGE: (key, start, end) => {
        return list[key as string].slice(start as number, end as number);
      },
    } as unknown as typeof redisClient,
  } as AppContainer;

  beforeEach(async () => {
    list = { route_list: [] };

    repository = createRouteRepository(mockContainer);
  });

  afterEach(async () => {});

  it("should be defined", () => {
    expect(repository).toBeDefined();
  });

  it("should return [] with empty repo", async () => {
    const routes = await repository.getRoutes(10);
    expect(routes).toMatchObject([]);
  });
  it("shoud add a route correctly", async () => {
    repository.addRoute(route);
    const routes = await repository.getRoutes(10);

    expect(routes).toMatchObject([route]);
  });
});
