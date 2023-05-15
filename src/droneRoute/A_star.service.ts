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
  const xAxisIndex: string = "ABCDEFGH";
  const yDistance = Math.pow(end.yAxis - start.yAxis, 2);
  const xDistance = Math.pow(
    xAxisIndex.indexOf(end.xAxis) - xAxisIndex.indexOf(start.xAxis),
    2
  );
  return Math.sqrt(yDistance + xDistance);
}

export function calcRoute(board: Chessboard, start: Coordinate, end: Coordinate) {
  // Implement as a priority queue or hashmap?
  const openSet: AStarCoord[] = [];

  // Use Map instead of Obj to create hash map?
  const closeSet = new Map<string, AStarCoord>();

  openSet.push({
    ...start,
    gScore: 0,
    fScore: calcHeuristics(start, end) * board.avrgTime,
    previous: null,
  } as AStarCoord);

  while (openSet.length > 0) {
    let currentCoord: AStarCoord;
    let lowestIndex = 0;

    // Implemet tree or sorted list /priority queue ?
    for (let i = 0; i < openSet.length; i++) {
      if (openSet[i].fScore < openSet[lowestIndex].fScore) lowestIndex = i;
    }

    currentCoord = openSet[lowestIndex];

    if ((currentCoord.xAxis + currentCoord.yAxis) === (end.xAxis + end.yAxis))
      return {
        path: reversePath(closeSet, currentCoord),
        cost: currentCoord.gScore,
      };

    const adjacentCoord = Object.entries(
      board.map[currentCoord.xAxis + currentCoord.yAxis]
    );

    closeSet.set(currentCoord.xAxis + currentCoord.yAxis, currentCoord);
    openSet.splice(lowestIndex, 1);

    for (let i = 0; i < adjacentCoord.length; i++) {
      let address = adjacentCoord[i][0];
      let newCost = currentCoord.gScore + adjacentCoord[i][1];
      let openIndex = openSet.findIndex(
        (coord) => coord.xAxis + coord.yAxis === address
      );

      //   Case the node was not visited or a faster path is found
      if ((openSet[openIndex]?.gScore ?? Infinity) > newCost) {
        const coord = { xAxis: address[0], yAxis: Number(address[1]) };

        openSet.splice(openIndex, 1 + Math.min(0, openIndex), {
          ...coord,
          gScore: newCost,
          fScore: newCost + calcHeuristics(coord, end),
          previous: currentCoord,
        });
      }
    }
  }
}
