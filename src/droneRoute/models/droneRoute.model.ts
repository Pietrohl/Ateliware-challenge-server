import { type Coordinate } from "./coordinate.model";

export type DroneRoute = {
  initialCoordinate: Coordinate;
  packageCoordinate: Coordinate;
  deliveryCoordinate: Coordinate;
  path: Coordinate[];
  time: number;
};
