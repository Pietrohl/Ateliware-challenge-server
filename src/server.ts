import type { AwilixContainer } from "awilix";
import e from "express";
import helmet from "helmet";
import { configureContainer, type AppContainer } from "./container";
import { redisClient } from "./db/redisClient.connection";
import { morganMiddleware } from "./middlware/httpLogger.middleware";
import { logger } from "./utils";

// Add new token with new router
type RouterTokens = "droneRouteRouter";

const attachRoutes = (
  app: e.Express,
  container: AwilixContainer<AppContainer>
) => {
  const routes: Array<{ routerToken: RouterTokens; path: string }> = [
    { routerToken: "droneRouteRouter", path: "/routes" },
  ];

  routes.forEach(({ routerToken, path }) => {
    logger.info(`attaching ${routerToken} router to "${path}" path...`);
    app.use(path, container.resolve(routerToken));
  });
};

const exitHandler = () => {
  logger.info("shutting down server...");
  redisClient
    .quit()
    .then(() => process.exit())
    .catch((error) => {
      logger.error("failed to shutdown server stack");
      logger.error(error.stack);
    });
};

const createServer = async () => {
  logger.info("bootstraping server...");
  const app = e();
  app.use(helmet());
  app.use(morganMiddleware);
  const container = await configureContainer();
  attachRoutes(app, container);

  // Handle Server Exit
  process.once("SIGINT", exitHandler);
  process.once("SIGUSR2", exitHandler);

  return app;
};

export { createServer };

