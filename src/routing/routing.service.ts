export interface RoutingService {
  listLastCalculatedRoutes: () => string[];
  calculateNewRoute: (
    dronePosition: string,
    packagePosition: string,
    deliveryPosition: string
  ) => { path: string; time: string };
}

export const createRoutingService = (): RoutingService => {
  return {
    listLastCalculatedRoutes: () => ["lastroute"],
    calculateNewRoute: () => ({ path: "mockPath", time: "mockTime" }),
  };
};
