import type { RequestHandler } from "express";
import type { AppContainer } from "../container";

export const createRoutingController = ({
  routingService,
}: AppContainer): { list: RequestHandler } => {
  return {
    list: (_req, res) => {
      console.log("responding get");
      res.json(routingService.listLastCalculatedRoutes());
    },
  };
};
