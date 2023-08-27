interface IBinaryHeap<T> {
  findMin: () => T | undefined;
  extractMin: () => T | undefined;
  deleteMin: () => void;
  insert: (val: number, value: T) => number;
  decreaseKey: (index: number, newKey: number, val?: T) => BinNode<T>;
  clear(): void;
  noNodes: number;
  values: BinNode<T>[];
}
interface BinNode<T> {
  key: number;
  value: T;
}

export class BinaryHeap<T> implements IBinaryHeap<T> {
  values: BinNode<T>[];

  constructor() {
    this.values = [];
  }

  clear() {
    this.values = [];
  }

  insert(key: number, value: T) {
    const newNode = { key, value };
    return this._insert(newNode);
  }

  protected _insert(newNode: BinNode<T>) {
    this.values.push(newNode);
    return this.bubbleUp();
  }

  extractMin() {
    const min = this.values[0];
    const end = this.values.pop();
    if (this.values.length > 0) {
      this.values[0] = end!;
      this.sinkDown();
    }
    return min?.value;
  }

  bubbleUp(index = this.values.length - 1): number {
    const node = this.values[index];
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      const parentNode = this.values[parentIndex];
      if (node.key >= parentNode.key) return index;
      this.values[parentIndex] = node;
      this.values[index] = parentNode;
      index = parentIndex;
    }
    return index;
  }

  sinkDown(index = 0) {
    const length = this.values.length;
    const node = this.values[0];
    while (true) {
      const leftChildIndex = 2 * index + 1;
      const rightChildIndex = 2 * index + 2;
      let leftChild: BinNode<T> | null = null;
      let rightChild: BinNode<T> | null = null;
      let swap = null;

      if (leftChildIndex < length) {
        leftChild = this.values[leftChildIndex];
        if (leftChild.key < node.key) {
          swap = leftChildIndex;
        }
      }
      if (rightChildIndex < length) {
        rightChild = this.values[rightChildIndex];
        if (
          (swap !== null && rightChild.key < leftChild!.key) ||
          (swap === null && rightChild.key < node.key)
        ) {
          swap = rightChildIndex;
        }
      }
      if (swap === null) break;
      this.values[index] = this.values[swap];
      this.values[swap] = node;
      index = swap;
    }
  }

  findMin() {
    return this.values[0]?.value;
  }

  deleteMin() {
    this.extractMin();
  }

  decreaseKey(index: number, newKey: number, val?: T) {
    const node = this.values[index];
    if (newKey > node.key) return node;
    node.key = newKey;
    if (val) node.value = val;
    this.bubbleUp(index);
    return node;
  }

  get noNodes() {
    return this.values.length;
  }
}
