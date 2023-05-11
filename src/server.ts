import e from "express";
import helmet from "helmet";
import { container } from "./container";
import { morganMiddleware } from "./middlware/httpLogger.middleware";
import { logger } from "./utils";

// Add new token with new router
type RouterTokens = "routingRouter";

const attachRoutes = (app: e.Express) => {
  const routes: Array<{ routerToken: RouterTokens; path: string }> = [
    { routerToken: "routingRouter", path: "/routing" },
  ];

  routes.forEach(({ routerToken, path }) => {
    logger.info(`Attaching ${routerToken} router to ${path}`);
    app.use(path, container.resolve(routerToken));
  });
};

const createServer = () => {
  logger.info("bootstraping server");
  const app = e();
  app.use(helmet());
  app.use(morganMiddleware);
  attachRoutes(app);

  return app;
};

export { createServer };

