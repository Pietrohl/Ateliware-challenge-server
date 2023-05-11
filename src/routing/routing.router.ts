import { Router, type RequestHandler } from "express";

export const createRoutingRouter: (container: any) => Router = (container) => {
  const router = Router();

  router.get(".", container.routingController.list as RequestHandler);

  return router;
};
