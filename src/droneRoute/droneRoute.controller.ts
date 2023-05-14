import type { RequestHandler } from "express";
import type { AppContainer } from "../container";

export interface RoutingController {
  list: RequestHandler;
  findNewPath: RequestHandler;
}

export const createDroneRouteController = ({
  droneRouteService: routingService,
}: AppContainer): RoutingController => {
  return {
    list: (_, res) => {
      res.json(routingService.listLastCalculatedRoutes());
    },
    findNewPath: () => {},
  };
};
