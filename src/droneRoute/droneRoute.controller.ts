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
  logger.info("initiating drone route controller...");

  return {
    list: async (_, res) => {
      res.status(200);
      res.json(await routingService.listLastCalculatedRoutes());
    },
    findNewPath: async (req, res) => {
      const { initialCoordinate, packageCoordinate, deliveryCoordinate } =
        req.body;
      res.status(201);

      res.json({
        newRoute: await routingService.calculateNewRoute(
          initialCoordinate,
          packageCoordinate,
          deliveryCoordinate
        ),
      });
    },
  };
};
