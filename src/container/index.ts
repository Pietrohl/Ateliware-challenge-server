import { InjectionMode, asFunction, createContainer } from "awilix";
import { createRoutingController } from "../routing/routing.controller";
import { createRoutingRouter } from "../routing/routing.router";
import { createRoutingService } from "../routing/routing.service";

export interface AppContainer {
  routingController: any;
  routingRouter: any;
  routingService: any;
}

export const container = createContainer<AppContainer>({
  injectionMode: InjectionMode.PROXY,
});

container.register({
  routingService: asFunction(createRoutingService),
  routingController: asFunction(createRoutingController),
  routingRouter: asFunction(createRoutingRouter),
});
