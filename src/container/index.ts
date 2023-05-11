import { InjectionMode, asFunction, createContainer } from "awilix";
import type { Router } from "express";
import {
  createRoutingController,
  type RoutingController,
} from "../routing/routing.controller";
import { createRoutingRouter } from "../routing/routing.router";
import {
  createRoutingService,
  type RoutingService,
} from "../routing/routing.service";

export interface AppContainer {
  routingController: RoutingController;
  routingRouter: Router;
  routingService: RoutingService;
}

export const container = createContainer<AppContainer>({
  injectionMode: InjectionMode.PROXY,
});

container.register({
  routingService: asFunction(createRoutingService),
  routingController: asFunction(createRoutingController),
  routingRouter: asFunction(createRoutingRouter),
});
