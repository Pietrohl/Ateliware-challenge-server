import type { RequestHandler } from "express";
import type { AppContainer } from "../container";

export interface RoutingController {
  list: RequestHandler;
  findNewPath: RequestHandler;
}

export const createRoutingController = ({
  routingService,
}: AppContainer): RoutingController => {
  return {
    list: (_req, res) => {
      res.json(routingService.listLastCalculatedRoutes());
    },
    findNewPath: () => {},
  };
};
