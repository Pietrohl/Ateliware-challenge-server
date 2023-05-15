import { Router } from "express";
import type { AppContainer } from "../container";
import { asyncWrap, logger } from "../utils";

export const createRoutingRouter = ({ droneRouteController }: AppContainer) => {
  logger.info("initiating drone route router...");
  const router = Router();
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  router.get("", asyncWrap(droneRouteController.list));
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  router.post("", asyncWrap(droneRouteController.findNewPath));

  return router;
};
