import { Router } from "express";
import type { AppContainer } from "../container";
import { logger } from "../utils";

export const createRoutingRouter = ({ droneRouteController }: AppContainer) => {
  logger.info("initiating drone route router...");
  const router = Router();
  router.get("", droneRouteController.list);
  router.post("", droneRouteController.findNewPath);

  return router;
};
