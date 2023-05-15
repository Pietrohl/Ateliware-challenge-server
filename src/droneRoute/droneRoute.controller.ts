import type { RequestHandler } from "express";
import type { AppContainer } from "../container";
import { logger } from "../utils";

export interface RoutingController {
  list: RequestHandler;
  findNewPath: RequestHandler;
}

export const createDroneRouteController = ({
  droneRouteService: routingService,
}: AppContainer): RoutingController => {
  logger.info('initiating drone route controller...')

  return {
    list: (_, res) => {
      res.json(routingService.listLastCalculatedRoutes());
    },
    findNewPath: () => {},
  };
};
