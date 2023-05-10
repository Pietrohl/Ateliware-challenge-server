import e from "express";
import helmet from "helmet";

const bootstrapServer = () => {
  const app = e();
  app.use(helmet());

  return app;
};

export { bootstrapServer };

