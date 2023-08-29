import FibonacciHeap, { FibNode } from "../utils/fibonacciHeap";
import {
  isChessboardMap,
  type Chessboard,
  type GraphNode,
} from "../chessboard/models/chessboard.model";
import { BinaryHeap } from "../utils/binaryHeap";

type AStarNode<T> = T & {
  gScore: number;
  fScore: number;
  previous: AStarNode<T> | null;
};

function reversePath(
  closeSet: Map<string, AStarNode<{ key: string }>>,
  args: AStarNode<{ key: string }>
): string[] {
  const path: string[] = [args.key];
  let next = args.previous;

  while (next) {
    path.push(next.key);

    next = next.previous;
  }

  return path.reverse();
}

type CalcRouteProp = {
  graph: PlanarGraph;
  startKey: string;
  endKey: string;
};

export class PlanarGraph {
  nodeList: Map<string, GraphNode>;
  avrgTime: number;
  avrgHeurs: number;
  customPosFromKey?: (key: string) => { x: number; y: number };

  constructor(
    board: Chessboard,
    customPosFromKey?: (key: string) => { x: number; y: number }
  ) {
    if (!isChessboardMap(board.map)) {
      throw new Error("Wrong map type");
    }

    this.customPosFromKey = customPosFromKey;

    this.nodeList = new Map<string, GraphNode>();
    this.avrgTime = board.avrgTime;
    this.avrgHeurs = board.avrgTime * 0.75;

    for (const [key, neighbors] of Object.entries(board.map)) {
      this.nodeList.set(key, {
        key,
        pos: this._posFromKey(key),
        neighbors: Object.entries(neighbors).map(([key, stepTime]) => ({
          node: key,
          stepCost: stepTime,
        })),
      });
    }
  }

  getNeighbors(key: string): GraphNode["neighbors"] {
    debugger;
    const node = this.nodeList.get(key);

    if (!node) {
      throw new Error("Node not found");
    }

    return node.neighbors;
  }

  calcHeuristics(start: string, end: string): number {
    const startCoord = this.nodeList.get(start);
    const endCoord = this.nodeList.get(end);

    if (!startCoord || !endCoord) {
      throw new Error("Node not found " + start + " " + end);
    }

    return this._calcHeuristics(startCoord, endCoord);
  }

  protected _calcHeuristics(start: GraphNode, end: GraphNode): number {
    return (
      Math.sqrt(
        Math.pow(this._getDistance(end.pos.y, start.pos.y), 2) +
          Math.pow(this._getDistance(Number(end.pos.x), Number(start.pos.x)), 2)
      ) * this.avrgHeurs
    );
  }

  protected _getDistance(index1: number, index2: number): number {
    if (typeof index1 === "number" && typeof index2 === "number") {
      return index1 - index2;
    }

    throw new Error("Wrong coordinate types");
  }

  protected _posFromKey(key: string): { x: number; y: number } {
    if (this.customPosFromKey) return this.customPosFromKey(key);

    function isCharNumber(c: string) {
      return c >= "0" && c <= "9";
    }

    const xAxis = [];
    const yAxis = [];

    for (const char of key) {
      if (isCharNumber(char)) {
        yAxis.push(char);
      } else {
        xAxis.push(char);
      }
    }

    return {
      x:
        xAxis
          .map((val) => val.charCodeAt(0) - 64)
          .reduce(
            (prev, val, index, arr) =>
              prev + val * Math.pow(26, arr.length - index - 1),
            0
          ) - 1,
      y: Number(yAxis.join("")) - 1,
    };
  }
}

function calcRoute(
  args: CalcRouteProp,
  type: "binary" | "fib" | "array" = "array"
) {
  if (type === "binary") return calcRouteMapBinaryQueue(args);

  if (type === "fib") return calcRouteMapFibonacci(args);

  return calcRouteArray(args);
}

const openSetQueueFib = new FibonacciHeap<AStarNode<{ key: string }>>();
function calcRouteMapFibonacci({ startKey, endKey, graph }: CalcRouteProp):
  | {
      path: string[];
      cost: number;
    }
  | undefined {
  openSetQueueBin.clear();
  const openSet = new Map<string, FibNode<AStarNode<{ key: string }>>>();

  const closeSet = new Map<string, AStarNode<{ key: string }>>();

  const startHeur = graph.calcHeuristics(startKey, endKey);

  const startNode = openSetQueueFib.insert(startHeur, {
    key: startKey,
    gScore: 0,
    fScore: startHeur,
    previous: null,
  });

  openSet.set(startKey, startNode);

  while (openSetQueueFib.noNodes > 0) {
    const currentCoord: AStarNode<{ key: string }> | undefined =
      openSetQueueFib.extractMin();

    if (!currentCoord) {
      break;
    }

    const currentKey = currentCoord.key;

    if (currentKey === endKey)
      return {
        path: reversePath(closeSet, currentCoord),
        cost: currentCoord.gScore,
      };

    openSet.delete(currentKey);
    closeSet.set(currentKey, currentCoord);

    const adjacentCoords = graph.getNeighbors(currentKey);

    // Mapping through the new coordinate neighbors
    for (const { node, stepCost } of adjacentCoords) {
      // Calculating new step time to reach the neighbor address coordnate
      const newGScore = currentCoord.gScore + stepCost;

      // Case a faster path was already found to a visited node
      const closeCoord = closeSet.get(node);
      if (closeCoord && closeCoord.gScore <= newGScore) {
        continue;
      }

      const fScore = newGScore + graph.calcHeuristics(node, endKey);

      // Case a faster path is found to a queued node
      const openCoord = openSet.get(node);
      if (openCoord) {
        if (openCoord.value.gScore > newGScore) {
          openSetQueueFib.decreaseKey(openCoord, fScore, {
            key: node,
            gScore: newGScore,
            fScore,
            previous: currentCoord,
          });
        }

        continue;
      }

      const queuedNode = openSetQueueFib.insert(fScore, {
        key: node,
        gScore: newGScore,
        fScore,
        previous: currentCoord,
      });

      openSet.set(node, queuedNode);
    }
  }

  throw new Error();
}

function calcRouteArray({ startKey, endKey, graph }: CalcRouteProp): {
  path: string[];
  cost: number;
} {
  // Implement as a priority queue or hashmap?
  const openSet = new Map<string, AStarNode<{ key: string }>>();

  // Use Map instead of Obj to create hash map?
  const closeSet = new Map<string, AStarNode<{ key: string }>>();

  const fScore = graph.calcHeuristics(startKey, endKey);

  openSet.set(startKey, {
    key: startKey,
    gScore: 0,
    fScore,
    previous: null,
  });

  while (openSet.size > 0) {
    let currentCoord: AStarNode<{ key: string }> | undefined;
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

    openSet.delete(currentKey);
    closeSet.set(currentKey, currentCoord);

    const adjacentCoords = graph.getNeighbors(currentKey);
    for (const { node, stepCost } of adjacentCoords) {
      const newGScore = currentCoord.gScore + stepCost;

      // Case the node was not visited or a faster path is found
      const openCoord = openSet.get(node);
      if (openCoord && openCoord.gScore <= newGScore) {
        continue;
      }

      const closeCoord = closeSet.get(node);
      if (closeCoord && closeCoord.gScore <= newGScore) {
        continue;
      }

      const fScore = newGScore + graph.calcHeuristics(node, endKey);

      openSet.set(node, {
        key: node,
        gScore: newGScore,
        fScore,
        previous: currentCoord,
      });
    }
  }

  throw new Error();
}
const openSetQueueBin = new BinaryHeap<AStarNode<{ key: string }>>();

function calcRouteMapBinaryQueue({ startKey, endKey, graph }: CalcRouteProp):
  | {
      path: string[];
      cost: number;
    }
  | undefined {
  openSetQueueBin.clear();
  const openSet = new Map<string, AStarNode<{ key: string }>>();
  const closeSet = new Map<string, AStarNode<{ key: string }>>();

  const fScore = graph.calcHeuristics(startKey, endKey);

  const startNode = {
    key: startKey,
    gScore: 0,
    fScore,
    previous: null,
  };

  openSetQueueBin.insert(0, startNode);
  openSet.set(startKey, startNode);

  while (openSetQueueBin.noNodes > 0) {
    const currentCoord: AStarNode<{ key: string }> | undefined =
      openSetQueueBin.extractMin();

    if (!currentCoord) {
      break;
    }

    const currentKey = currentCoord.key;

    if (currentKey === endKey)
      return {
        path: reversePath(closeSet, currentCoord),
        cost: currentCoord.gScore,
      };

    openSet.delete(currentKey);
    closeSet.set(currentKey, currentCoord);

    const adjacentCoord = graph.getNeighbors(currentKey);

    // Mapping through the new coordinate neighbors
    for (const { node, stepCost } of adjacentCoord) {
      // Calculating new step time to reach the neighbor address coordnate
      const newGScore = currentCoord.gScore + stepCost;

      // Case a faster path was already found to a visited node
      const closeCoord = closeSet.get(node);
      if (closeCoord && closeCoord.gScore <= newGScore) {
        continue;
      }

      const fScore = newGScore + graph.calcHeuristics(node, endKey);

      // Case a faster path is found to a queued node
      const openCoord = openSet.get(node);

      if (openCoord) {
        if (openCoord.gScore > newGScore) {
          const queuedCoord = {
            ...openCoord,
            gScore: newGScore,
            fScore,
            previous: currentCoord,
          };

          const index = openSetQueueBin.values.findIndex(
            (node) => node.value === openCoord
          );
          openSetQueueBin.decreaseKey(index, fScore, queuedCoord);
          openSet.set(node, queuedCoord);
        }

        continue;
      }

      const queuedNode = {
        key: node,
        gScore: newGScore,
        fScore,
        previous: currentCoord,
      };
      openSetQueueBin.insert(fScore, queuedNode);
      openSet.set(node, queuedNode);
    }
  }

  throw new Error();
}

export { calcRoute };
