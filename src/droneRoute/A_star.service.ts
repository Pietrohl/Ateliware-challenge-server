import FibonacciHeap from "../utils/fibonacciHeap";
import {
  isChessboardMap,
  type Chessboard,
  type ChessboardMap,
} from "../chessboard/models/chessboard.model";
import type { Coordinate } from "./models/coordinate.model";

type AStarCoord = Coordinate & {
  gScore: number;
  fScore: number;
  previous: Coordinate | null;
};

function reversePath(
  closeSet: Map<string, AStarCoord>,
  { xAxis, yAxis, previous }: AStarCoord
): Coordinate[] {
  const path: Coordinate[] = [{ xAxis, yAxis }];
  let next = previous;

  while (next) {
    const currCoord = closeSet.get(next.xAxis + next.yAxis.toString());
    next = null;
    if (currCoord) {
      next = currCoord.previous;
      path.push({ xAxis: currCoord.xAxis, yAxis: currCoord.yAxis });
    }
  }

  return path.reverse();
}

function getDistance(index1: string, index2: string): number;
function getDistance(index1: number, index2: number): number;
function getDistance(index1: string | number, index2: string | number): number {
  if (typeof index1 === "number" && typeof index2 === "number") {
    return index1 - index2;
  }

  if (typeof index1 === "string" && typeof index2 === "string") {
    const alph = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    return alph.indexOf(index1) - alph.indexOf(index2);
  }

  throw new Error("Wrong coordinate types");
}

function calcHeuristics(start: Coordinate, end: Coordinate): number {
  return Math.sqrt(
    Math.pow(getDistance(end.yAxis, start.yAxis), 2) +
      Math.pow(getDistance(end.xAxis, start.xAxis), 2)
  );
}

type CalcRouteProp = {
  board: Chessboard;
  start: Coordinate;
  end: Coordinate;
};

type CalcRouteMapProp = {
  map: ChessboardMap;
  avrgTime: number;
  start: Coordinate;
  end: Coordinate;
};

function calcRoute(args: CalcRouteProp, type: "fib" | "map" = "map") {
  if (isChessboardMap(args.board.map) && type === "map")
    return calcRouteMap({
      map: args.board.map,
      avrgTime: args.board.avrgTime,
      ...args,
    });

  return calcRouteMapQueue({
    map: args.board.map as ChessboardMap,
    avrgTime: args.board.avrgTime,
    ...args,
  });
}

function calcRouteMapQueue({ map, avrgTime, start, end }: CalcRouteMapProp):
  | {
      path: Coordinate[];
      cost: number;
    }
  | undefined {
  // Implement as a priority queue or hashmap?
  const openSet = new Map<number, AStarCoord>();
  const openSetQueue = new FibonacciHeap();

  const closeSet = new Map<string, AStarCoord>();

  const endKey = end.xAxis + end.yAxis.toString();

  const startKey = calcHeuristics(start, end) * avrgTime;
  openSetQueue.insert(startKey);
  openSet.set(startKey, {
    ...start,
    gScore: 0,
    fScore: startKey,
    previous: null,
  });

  while (openSet.size > 0) {
    const currentKey = openSetQueue.extractMin();
    const currentCoord = openSet.get(currentKey);
    if (!currentCoord || !currentKey) {
      break;
    }

    const currCoordString = currentCoord.xAxis + currentCoord.yAxis.toString();

    if (currCoordString === endKey)
      return {
        path: reversePath(closeSet, currentCoord),
        cost: currentCoord.gScore,
      };

    const adjacentCoord = map[currCoordString];

    openSet.delete(currentKey);
    closeSet.set(currCoordString, currentCoord);

    // Mapping through the new coordinate neighbors
    for (const [address, stepTime] of Object.entries(adjacentCoord)) {
      // Calculating new step time to reach the neighbor address coordnate
      const newGScore = currentCoord.gScore + stepTime;
      const coord: Coordinate = {
        xAxis: address[0],
        yAxis: Number(address[1]),
      };

      // Case the node was not visited or a faster path is found
      const closeCoord = closeSet.get(address);
      if (closeCoord && closeCoord.gScore <= newGScore) {
        continue;
      }

      const fScore = newGScore + calcHeuristics(coord, end);

      openSetQueue.insert(fScore);
      openSet.set(fScore, {
        ...coord,
        gScore: newGScore,
        fScore,
        previous: currentCoord,
      });
    }
  }
  // throw new Error();
}

function calcRouteMap({ map, avrgTime, start, end }: CalcRouteMapProp): {
  path: Coordinate[];
  cost: number;
} {
  // Implement as a priority queue or hashmap?
  const openSet = new Map<string, AStarCoord>();

  // Use Map instead of Obj to create hash map?
  const closeSet = new Map<string, AStarCoord>();

  const startKey = start.xAxis + start.yAxis.toString();
  const endKey = end.xAxis + end.yAxis.toString();

  openSet.set(startKey, {
    ...start,
    gScore: 0,
    fScore: calcHeuristics(start, end) * avrgTime,
    previous: null,
  });

  while (openSet.size > 0) {
    let currentCoord: AStarCoord | undefined;
    let lowestFScore = Infinity;
    let currentKey: string | undefined;

    // Implemet tree or sorted list /priority queue ?
    for (const [key, value] of openSet) {
      if (value.fScore < lowestFScore) {
        currentCoord = value;
        lowestFScore = value.fScore;
        currentKey = key;
      }
    }

    if (!currentCoord || !currentKey) {
      break;
    }

    if (currentKey === endKey)
      return {
        path: reversePath(closeSet, currentCoord),
        cost: currentCoord.gScore,
      };

    const adjacentCoord = map[currentKey];

    openSet.delete(currentKey);
    closeSet.set(currentKey, currentCoord);

    for (const [address, stepTime] of Object.entries(adjacentCoord)) {
      const newGScore = currentCoord.gScore + stepTime;
      const coord: Coordinate = {
        xAxis: address[0],
        yAxis: Number(address[1]),
      };

      //   Case the node was not visited or a faster path is found
      const openCoord = openSet.get(address);
      if (openCoord && openCoord.gScore <= newGScore) {
        continue;
      }

      const closeCoord = closeSet.get(address);
      if (closeCoord && closeCoord.gScore <= newGScore) {
        continue;
      }

      const fScore = newGScore + calcHeuristics(coord, end);

      openSet.set(address, {
        ...coord,
        gScore: newGScore,
        fScore,
        previous: currentCoord,
      });
    }
  }

  throw new Error();
}

export { calcRoute, calcRouteMap };
