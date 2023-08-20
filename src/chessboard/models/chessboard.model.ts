import type { Coordinate } from "src/droneRoute/models/coordinate.model";

export type CoordinateStepTimes = {
  [key: string]: number;
};

export type ChessboardMap = {
  [key: string]: {
    [key: string]: number;
  };
};

export type ChessboardNode = {
  coordinate: Coordinate;
  neighbors: Array<{ coordinate: Coordinate; stepCost: number }>;
};

export type Chessboard = {
  map: ChessboardMap | Array<Array<ChessboardNode>>;
  avrgTime: number;
};

export function isChessboardMap(
  obj: ChessboardNode[][] | ChessboardMap
): obj is ChessboardMap {
  return !Array.isArray(obj);
}
