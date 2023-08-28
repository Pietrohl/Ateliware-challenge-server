import type { Coordinate } from "../../droneRoute/models/coordinate.model";

export type CoordinateStepTimes = {
  [key: string]: number;
};

export type ChessboardMap = {
  [key: string]: {
    [key: string]: number;
  };
};

export type GraphNode = {
  key: string;
  pos: Coordinate;
  neighbors: Array<{ node: string; stepCost: number }>;
};

export type Chessboard = {
  map: ChessboardMap;
  avrgTime: number;
};

export function isChessboardMap(
  obj: GraphNode[][] | ChessboardMap
): obj is ChessboardMap {
  return !Array.isArray(obj);
}
