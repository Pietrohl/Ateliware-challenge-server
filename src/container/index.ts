import { InjectionMode, asFunction, createContainer } from "awilix";
import type { Router } from "express";
import type { ChessboardRepository } from "../chessboard/chessboard.repository";
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

export interface AppContainer {
  droneRouteController: RoutingController;
  droneRouteRouter: Router;
  droneRouteService: DroneRouteService;
  droneRouteRepository: DroneRouteRepository;
  chessboardRepository: ChessboardRepository
}

export const container = createContainer<AppContainer>({
  injectionMode: InjectionMode.PROXY,
});

container.register({
  droneRouteService: asFunction(createDroneRouteService),
  droneRouteController: asFunction(createDroneRouteController),
  droneRouteRouter: asFunction(createRoutingRouter),
  droneRouteRepository: asFunction(createRouteRepository),
});
