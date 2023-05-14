import e from "express";
import helmet from "helmet";
import { container } from "./container";
import { redisClient } from "./db/redisClient.connection";
import { morganMiddleware } from "./middlware/httpLogger.middleware";
import { logger } from "./utils";

// Add new token with new router
type RouterTokens = "droneRouteRouter";

const attachRoutes = (app: e.Express) => {
  const routes: Array<{ routerToken: RouterTokens; path: string }> = [
    { routerToken: "droneRouteRouter", path: "/routes" },
  ];

  routes.forEach(({ routerToken, path }) => {
    logger.info(`Attaching ${routerToken} router to ${path}`);
    app.use(path, container.resolve(routerToken));
  });
};

const exitHandler = () => {
  logger.info('Shutting down server')
  redisClient
    .quit()
    .then(() => process.exit())
    .catch((error) => {
      logger.error("Failed to shutdown server stack");
      logger.error(error.stack);
    });
};

const createServer = () => {
  logger.info("bootstraping server");
  const app = e();
  app.use(helmet());
  app.use(morganMiddleware);
  attachRoutes(app);

  // Handle Server Exit
  process.once("SIGINT", exitHandler);
  process.once("SIGUSR2", exitHandler);

  return app;
};

export { createServer };

