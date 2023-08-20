interface IFibonacciHeap {
  findMin: () => number;
  extractMin: () => number;
  deleteMin: () => void;
  insert: (val: number) => void;
  decreaseKey: () => void;
}

class FibNode {
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

export class FibonacciHeap implements IFibonacciHeap {
  min: FibNode;
  noNodes: number;

  constructor() {
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
      newNode.right = this.min;
      newNode.left = this.min.left;
      if (this.min.left) this.min.left.right = newNode;
      this.min.left = newNode;
      if (newNode.key < this.min.key) {
        this.min = newNode;
      } else {
        this.min = newNode;
      }
    }
    this.noNodes++;
  }

  private _removeFromList(node: FibNode) {
    if (node.left) node.left.right = node.right;
    if (node.right) node.right.left = node.left;
    node.left = node;
    node.right = node;
  }

  private _mergeLists(
    nodeX: FibNode | null,
    nodeY: FibNode | null
  ): FibNode | null {
    if (!nodeX && nodeY) return null;

    if (!nodeX) return nodeY;

    if (!nodeY) return nodeX;

    if (nodeX.right) nodeX.right.left = nodeY;
    if (nodeY.right) nodeY.right.left = nodeX;
    nodeX.right = nodeY.right;
    nodeY.right = nodeX.right;

    return nodeX;
  }

  private _linkHeaps(nodeX: FibNode, nodeY: FibNode): FibNode {
    let root = nodeX;
    if (root.key > nodeY.key) {
      root = nodeY;
      nodeY = nodeX;
    }

    root.child = this._mergeLists(root.child, nodeY);
    root.degree += 1;

    return root;
  }

  private _consolidate() {
    const aux: FibNode[] = [];

    let curr: FibNode | null = this.min;
    let next: FibNode | null | undefined = curr.left;
    while (curr) {
      this._removeFromList(curr);
      if (aux[curr.degree]) {
        curr = this._linkHeaps(aux[curr.degree], curr);
      } else {
        aux[curr.degree] = curr;
        curr = next ?? null;
        next = next?.left;
        if (next === curr) break;
      }
    }

    for (const iterator of aux) {
      const temp = this.min;
      if (iterator.key < this.min.key) this.min = iterator;

      this._mergeLists(temp, iterator);
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
        this._insert(child);
        child = nextChild;
      } while (child && child !== min.child);
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
