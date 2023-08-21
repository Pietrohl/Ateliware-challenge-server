interface IFibonacciHeap {
  findMin: () => number;
  extractMin: () => number;
  deleteMin: () => void;
  insert: (val: number) => void;
  decreaseKey: () => void;
  clear: () => void;
}

export class FibNode {
  parent: null | FibNode;
  child: null | FibNode;
  left: null | FibNode;
  right: null | FibNode;
  key: number;
  degree: number;

  constructor(key = -1) {
    this.parent = null; // Assign data
    this.child = null; // Initialize next as null
    this.left = null;
    this.right = null;
    this.key = key;
    this.degree = 0;
  }
}

class FibonacciHeap implements IFibonacciHeap {
  min: FibNode;
  noNodes: number;

  constructor() {
    this.min = new FibNode();
    this.noNodes = 0;
  }

  clear() {
    this.min = new FibNode();
    this.noNodes = 0;
  }

  findMin() {
    return this.min.key;
  }

  insert(key: number) {
    const newNode = new FibNode(key);
    this._insert(newNode);
  }
  private _insert(newNode: FibNode) {
    newNode.left = newNode;
    newNode.right = newNode;

    if (this.min.key !== -1) {
      const temp = this.min;
      this.min = this._mergeLists(this.min, newNode) ?? temp;
      if (newNode.key < temp.key) {
        this.min = newNode;
      } else {
        this.min = temp;
      }
    } else {
      this.min = newNode;
    }
    this.noNodes++;
  }

  protected _removeFromList(node: FibNode) {
    if (node.left) node.left.right = node.right;
    if (node.right) node.right.left = node.left;
    node.left = node;
    node.right = node;
  }

  protected _mergeLists(
    nodeX: FibNode | null,
    nodeY: FibNode | null
  ): FibNode | null {
    if (!nodeX && !nodeY) return null;

    if (!nodeX) return nodeY;

    if (!nodeY) return nodeX;

    const temp = nodeX.left;

    nodeX.left = nodeY.left;
    if (nodeX.left) nodeX.left.right = nodeX;
    nodeY.left = temp;
    if (nodeY.left) nodeY.left.right = nodeY;
    return nodeX;
  }

  protected _linkHeaps(nodeX: FibNode, nodeY: FibNode): FibNode {
    let root = nodeX;
    if (root.key > nodeY.key) {
      root = nodeY;
      nodeY = nodeX;
    }

    root.child = this._mergeLists(nodeY, root.child);
    nodeY.parent = root;
    root.degree += 1;

    return root;
  }

  protected _consolidate() {
    const aux: Array<FibNode | undefined> = [];

    let curr: FibNode | null = this.min;
    let mainList: FibNode | null | undefined = curr.left;
    while (curr) {
      this._removeFromList(curr);

      const deg = curr.degree;
      const auxNode = aux[deg];
      if (auxNode) {
        curr = this._linkHeaps(auxNode, curr);
        aux[deg] = undefined;
      } else {
        aux[curr.degree] = curr;
        if (mainList === curr) break;
        curr = mainList ?? null;
        if (mainList === mainList?.left) {
          mainList = null;
        } else {
          mainList = mainList?.left;
        }
      }
    }

    let temp: FibNode | null = null;
    for (const iterator of aux.filter<FibNode>(
      (value): value is FibNode => !!value
    )) {
      if (iterator?.key < this.min.key) this.min = iterator;
      temp = this._mergeLists(temp, iterator);
    }
  }

  extractMin: () => number = () => {
    const min = this.min;

    if (min.child) {
      let child: FibNode | null = min.child;
      let nextChild;
      do {
        nextChild = child.left;
        child.parent = null;
        child = nextChild;
      } while (child && child !== min.child);
      this._mergeLists(min, child);
    }

    if (min === min.left || min.left === null) {
      this.min = new FibNode();
    } else {
      this.min = min.left;
      this._removeFromList(min);
    }

    this.noNodes--;

    this._consolidate();
    return min.key;
  };

  decreaseKey: () => void;
  merge: () => void;

  deleteMin() {
    this.extractMin();
  }
}

export default FibonacciHeap;
