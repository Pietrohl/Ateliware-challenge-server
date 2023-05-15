import { InjectionMode, asFunction, asValue, createContainer } from "awilix";
import type { Router } from "express";
import type { ChessboardRepository } from "../chessboard/chessboard.repository";
import { redisClient } from "../db/redisClient.connection";
import {
  createDroneRouteController,
  type RoutingController,
} from "../droneRoute/droneRoute.controller";
import {
  createRouteRepository,
  type DroneRouteRepository,
} from "../droneRoute/droneRoute.repository";
import { createRoutingRouter } from "../droneRoute/droneRoute.router";
import {
  createDroneRouteService,
  type DroneRouteService,
} from "../droneRoute/droneRoute.service";
import { logger } from "../utils";

export interface AppContainer {
  droneRouteController: RoutingController;
  droneRouteRouter: Router;
  droneRouteService: DroneRouteService;
  droneRouteRepository: DroneRouteRepository;
  chessboardRepository: ChessboardRepository;
  connection: typeof redisClient;
}

export const configureContainer = async () => {
  logger.info("initiating container...");
  const container = createContainer<AppContainer>({
    injectionMode: InjectionMode.PROXY,
  });

  await redisClient.connect();

  container.register({ connection: asValue(redisClient) });

  container.register({
    droneRouteService: asFunction(createDroneRouteService),
    droneRouteController: asFunction(createDroneRouteController),
    droneRouteRouter: asFunction(createRoutingRouter),
    droneRouteRepository: asFunction(createRouteRepository),
  });

  return container;
};
