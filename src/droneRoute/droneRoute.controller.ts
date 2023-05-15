import type { NextFunction, Request, Response } from "express";
import type { AppContainer } from "../container";
import { logger } from "../utils";
import type { Coordinate } from "./models/coordinate.model";

export interface RoutingController {
  list: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  findNewPath: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<void>;
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
    findNewPath: async (
      req: Request<
        unknown,
        unknown,
        {
          initialCoordinate: Coordinate;
          packageCoordinate: Coordinate;
          deliveryCoordinate: Coordinate;
        }
      >,
      res
    ) => {
      const { deliveryCoordinate, initialCoordinate, packageCoordinate } =
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
