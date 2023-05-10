import type { Express } from "express";
import { config } from "./config";
import { bootstrapServer } from "./server";

function startServer(app: Express) {
  try {
    app.listen(config.PORT, "0.0.0.0", () => {
      console.log("running on port: ", config.PORT);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

startServer(bootstrapServer());
