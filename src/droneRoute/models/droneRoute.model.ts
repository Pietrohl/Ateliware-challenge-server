import { type Coordinate } from "./coordinate.model";

export type DroneRoute = {
  id: number;
  initialCoordinate: Coordinate;
  packageCoordinate: Coordinate;
  deliveryCoordinate: Coordinate;
  path: Coordinate[];
  time: number;
};
