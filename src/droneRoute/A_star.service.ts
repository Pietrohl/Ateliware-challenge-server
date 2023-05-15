import type { Chessboard } from "../chessboard/models/chessboard.model";
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
    const currCoord = closeSet.get(next.xAxis + next.yAxis);
    next = null;
    if (currCoord) {
      next = currCoord.previous;
      path.push({ xAxis: currCoord.xAxis, yAxis: currCoord.yAxis });
    }
  }

  return path.reverse();
}

function calcHeuristics(start: Coordinate, end: Coordinate): number {
  return Math.sqrt(
    Math.pow(end.yAxis - start.yAxis, 2) +
      Math.pow(
        "ABCDEFGH".indexOf(end.xAxis) - "ABCDEFGH".indexOf(start.xAxis),
        2
      )
  );
}

export function calcRoute(
  board: Chessboard,
  start: Coordinate,
  end: Coordinate
) {
  // Implement as a priority queue or hashmap?
  const openSet = new Map<string, AStarCoord>();

  // Use Map instead of Obj to create hash map?
  const closeSet = new Map<string, AStarCoord>();

  const startKey = start.xAxis + start.yAxis;
  const endKey = end.xAxis + end.yAxis;

  openSet.set(startKey, {
    ...start,
    gScore: 0,
    fScore: calcHeuristics(start, end) * board.avrgTime,
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

    const adjacentCoord = board.map[currentKey];

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
}
