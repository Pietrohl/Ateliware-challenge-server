interface IFibonacciHeap<T> {
  findMin: () => T | undefined;
  extractMin: () => T | undefined;
  deleteMin: () => void;
  insert: (val: number, value: T) => FibNode<T>;
  decreaseKey: (node: FibNode<T>, newKey: number, val?: T) => FibNode<T>;
  clear: () => void;
}

export class FibNode<T> {
  parent: null | FibNode<T>;
  child: null | FibNode<T>;
  left: null | FibNode<T>;
  right: null | FibNode<T>;
  key: number;
  degree: number;
  value: T;
  isMarked: boolean;

  constructor(value: T, key = -1) {
    this.parent = null; // Assign data
    this.child = null; // Initialize next as null
    this.left = null;
    this.right = null;
    this.key = key;
    this.degree = 0;
    this.isMarked = false;
    this.value = value;
  }
}

class FibonacciHeap<T> implements IFibonacciHeap<T> {
  min: FibNode<T> | null;
  noNodes: number;

  constructor() {
    this.min = null;
    this.noNodes = 0;
  }

  clear() {
    this.min = null;
    this.noNodes = 0;
  }

  findMin() {
    return this.min?.value;
  }

  insert(key: number, value: T) {
    const newNode = new FibNode<T>(value, key);
    this._insert(newNode);
    return newNode;
  }
  private _insert(newNode: FibNode<T>) {
    newNode.left = newNode;
    newNode.right = newNode;

    if (this.min?.key !== -1) {
      const temp = this.min;
      this.min = this._mergeLists(this.min, newNode) ?? temp;
      if (!temp || newNode.key < temp.key) {
        this.min = newNode;
      } else {
        this.min = temp;
      }
    } else {
      this.min = newNode;
    }
    this.noNodes++;
  }

  protected _removeFromList(node: FibNode<T>) {
    if (node.left) node.left.right = node.right;
    if (node.right) node.right.left = node.left;
    node.left = node;
    node.right = node;
  }

  protected _mergeLists(
    nodeX: FibNode<T> | null,
    nodeY: FibNode<T> | null
  ): FibNode<T> | null {
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

  protected _linkHeaps(nodeX: FibNode<T>, nodeY: FibNode<T>): FibNode<T> {
    let root = nodeX;
    if (root.key > nodeY.key) {
      root = nodeY;
      nodeY = nodeX;
    }

    root.child = this._mergeLists(nodeY, root.child);
    nodeY.parent = root;
    root.degree += 1;
    nodeY.isMarked = false;

    return root;
  }

  protected _consolidate() {
    const aux: Array<FibNode<T> | undefined> = [];

    let curr: FibNode<T> | null = this.min;
    let mainList: FibNode<T> | null | undefined = curr?.left;
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

    let temp: FibNode<T> | null = null;
    for (const iterator of aux.filter<FibNode<T>>(
      (value): value is FibNode<T> => !!value
    )) {
      if (!this.min || iterator?.key < this.min.key) this.min = iterator;
      temp = this._mergeLists(temp, iterator);
    }
  }

  extractMin() {
    const min = this.min;

    if (!min) return;

    if (min.child) {
      let child: FibNode<T> | null = min.child;
      let nextChild;
      do {
        nextChild = child.left;
        child.parent = null;
        child = nextChild;
      } while (child && child !== min.child);
      this._mergeLists(min, child);
    }

    if (min === min.left || min.left === null) {
      this.min = null;
    } else {
      this.min = min.left;
      this._removeFromList(min);
    }

    this.noNodes--;

    this._consolidate();
    return min.value;
  }

  merge: () => void;

  deleteMin() {
    this.extractMin();
  }

  decreaseKey(node: FibNode<T>, newKey: number, val?: T) {
    if (newKey > node.key) return node;

    node.key = newKey;
    if (val) node.value = val;

    if (node.parent && node.key < node.parent.key) {
      this._cut(node);
      this._cascadingCut(node.parent);
    }

    if (!this.min || node.key < this.min?.key) {
      this.min = node;
    }

    return node;
  }

  protected _cut(node: FibNode<T>) {
    if (node.parent) {
      if (node.left === node) {
        node.parent.child = null;
      } else {
        node.parent.child = node.left;
      }
      node.parent.degree--;
      node.parent = null;
    }

    this._removeFromList(node);
    this._insert(node);

    node.isMarked = false;
  }

  protected _cascadingCut(node?: FibNode<T>) {
    const parent = node?.parent;
    if (!parent) return;

    if (node.isMarked) {
      this._cut(node);
      this._cascadingCut(parent);
    } else {
      node.isMarked = true;
    }
  }
}

export default FibonacciHeap;
