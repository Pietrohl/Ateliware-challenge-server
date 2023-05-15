export type CoordinateStepTimes = {
  [key: string]: number;
};

export type ChessboardMap = {
  [key: string]: CoordinateStepTimes;
};

export type Chessboard = {
  map: ChessboardMap;
  avrgTime: number;
};
