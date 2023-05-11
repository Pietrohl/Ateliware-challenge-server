import e from "express";
import helmet from "helmet";
import { container, type AppContainer } from "./container";

const attachRoutes = (app: e.Express) => {
  const routes: Array<{ routerToken: keyof AppContainer; path: string }> = [
    { routerToken: "routingRouter", path: "/routing" },
  ];

  routes.forEach((router) => {
    app.use(router.path, container.resolve(router.routerToken));
  });
};

const createServer = () => {
  console.log("Creating Server");
  const app = e();
  app.use(helmet());
  attachRoutes(app);

  return app;
};

export { createServer };

