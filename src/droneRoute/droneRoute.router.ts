import { Router, type RequestHandler } from "express";
import type { AppContainer } from "../container";

export const createRoutingRouter = ({ droneRouteController }: AppContainer) => {
  const router = Router();

  router.get("", droneRouteController.list as RequestHandler);

  return router;
};
