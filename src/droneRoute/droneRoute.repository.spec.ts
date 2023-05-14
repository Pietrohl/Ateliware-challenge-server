import { redisClient } from "../db/redisClient.connection";
import { createRouteRepository, type DroneRouteRepository } from "./droneRoute.repository";

describe("DroneRoute Repository", () => {
  let repository: DroneRouteRepository ;

  beforeEach(async () => {
    repository = createRouteRepository();
    await redisClient.SELECT(10)
  });

  afterEach(async () => {
  });

  it("should be defined", () => {
    expect(repository).toBeDefined();
  });



  it('should return [] with empty repo', async () => {
    const routes = repository.getRoutes(10)
    expect(routes).toMatchObject([])

  })

});
