import FibonacciHeap, { FibNode } from "./index";

describe("Fibonacci heap private methods", () => {
  class FibonacciHeapExtended extends FibonacciHeap<{ value: number }> {
    constructor() {
      super();
    }

    _removeFromListExtend(arg: FibNode<{ value: number }>) {
      this._removeFromList(arg);
    }

    _mergeListsExtend(
      ...args: [FibNode<{ value: number }>, FibNode<{ value: number }>]
    ) {
      return this._mergeLists(...args);
    }

    _consolidateExtend() {
      this._consolidate();
    }

    _linkHeapsExtend(
      ...args: [FibNode<{ value: number }>, FibNode<{ value: number }>]
    ) {
      return this._linkHeaps(...args);
    }
  }

  let queue: FibonacciHeapExtended;
  let root: FibNode<{ value: number }>;
  let root2: FibNode<{ value: number }>;

  beforeEach(() => {
    queue = new FibonacciHeapExtended();

    root = new FibNode<{ value: number }>({ value: 1 }, 1);
    const node2 = new FibNode<{ value: number }>({ value: 2 }, 2);
    const node3 = new FibNode<{ value: number }>({ value: 3 }, 3);

    root.left = node2;
    node2.left = node3;
    node3.left = root;
    root.right = node3;
    node3.right = node2;
    node2.right = root;

    root2 = new FibNode<{ value: number }>({ value: 4 }, 4);
    const node2_2 = new FibNode<{ value: number }>({ value: 5 }, 5);
    const node3_2 = new FibNode<{ value: number }>({ value: 6 }, 6);

    root2.left = node2_2;
    node2_2.left = node3_2;
    node3_2.left = root2;
    root2.right = node3_2;
    node3_2.right = node2_2;
    node2_2.right = root2;
  });

  test("_removeFromList", () => {
    const temp = root.left;
    queue._removeFromListExtend(root);

    expect(root.key).toBe(1);
    expect(root).toEqual(root.left);
    expect(root).toEqual(root.right);

    expect(temp).not.toBeNull();
    expect(temp!.key).toBe(2);
    expect(temp!.left?.key).toBe(3);
    expect(temp!.left?.left?.key).toBe(2);
    expect(temp!.right?.key).toBe(3);
    expect(temp!.right?.right?.key).toBe(2);
  });

  test("_mergeLists", () => {
    queue._mergeListsExtend(root, root2);

    expect(root.key).toBe(1);
    expect(root.left?.key).toBe(5);
    expect(root.left?.left?.key).toBe(6);
    expect(root.left?.left?.left?.key).toBe(4);
    expect(root.left?.left?.left?.left?.key).toBe(2);
    expect(root.left?.left?.left?.left?.left?.key).toBe(3);
    expect(root.right?.key).toBe(3);
    expect(root.right?.right?.key).toBe(2);
    expect(root.right?.right?.right?.key).toBe(4);
    expect(root.right?.right?.right?.right?.key).toBe(6);
    expect(root.right?.right?.right?.right?.right?.key).toBe(5);
  });

  test("_mergeLists 2", () => {
    const node = new FibNode<{ value: number }>({ value: 10 }, 10);
    node.left = node;
    node.right = node;
    const temp = queue._mergeListsExtend(root, node);

    expect(temp!.key).toBe(1);
    expect(temp!.left?.key).toBe(10);
    expect(temp!.left?.left?.key).toBe(2);
    expect(temp!.right?.right?.right?.key).toBe(10);
  });

  test("_linkHeaps", () => {
    const child = new FibNode<{ value: number }>({ value: 10 }, 10);
    child.left = child;
    child.right = child;

    const resp = queue._linkHeapsExtend(child, root);

    expect(root).toBe(resp);
    expect(resp.child).toBe(child);
    expect(root.child?.key).toBe(10);
  });

  test("_linkHeaps 2 ", () => {
    const child = new FibNode<{ value: number }>({ value: 10 }, 10);
    child.left = child;
    child.right = child;

    let resp = queue._linkHeapsExtend(root2, root);
    resp = queue._linkHeapsExtend(child, root);

    expect(root).toBe(resp);
    expect(resp.child).toBe(child);
    expect(root.child?.key).toBe(10);
    expect(child.left?.key).toBe(5);
    expect(child.right?.key).toBe(4);
    expect(child.right?.right?.key).toBe(6);
  });

  test("_consolidate", () => {
    queue.insert(1, { value: 1 });
    queue.insert(2, { value: 2 });
    queue.insert(3, { value: 3 });
    queue.insert(4, { value: 4 });

    queue._consolidateExtend();
    expect(queue.findMin()).toEqual({ value: 1 });
    expect(queue.min?.left?.key).toBe(1);
    expect(queue.min?.right?.key).toBe(1);

    expect(queue.min?.child?.key).toBe(2);
    expect(queue.min?.child?.left?.key).toBe(4);
    expect(queue.min?.child?.right?.key).toBe(4);
    expect(queue.min?.child?.child?.key).toBe(3);
  });
});
describe("Fibonacci Heap functions", () => {
  let queue: FibonacciHeap<{ value: number }>;

  beforeEach(() => {
    queue = new FibonacciHeap<{ value: number }>();
  });

  it("Should insert correctly", () => {
    queue.insert(1, { value: 1 });
    queue.insert(2, { value: 2 });
    queue.insert(3, { value: 3 });
    queue.insert(4, { value: 4 });
    queue.insert(5, { value: 5 });
    expect(queue.findMin()).toEqual({ value: 1 });
    expect(queue.min?.left?.key).toBe(5);
    expect(queue.min?.left?.left?.key).toBe(4);
    expect(queue.min?.left?.left?.left?.key).toBe(3);
    expect(queue.min?.left?.left?.left?.left?.key).toBe(2);
    expect(queue.min?.right?.key).toBe(2);
  });

  it("should check the min correctly", () => {
    queue.insert(1, { value: 1 });
    expect(queue.findMin()).toEqual({ value: 1 });
  });

  it("should extract the min correctly", () => {
    queue.insert(2, { value: 2 });
    queue.insert(1, { value: 1 });
    expect(queue.findMin()).toEqual({ value: 1 });
    expect(queue.extractMin()).toEqual({ value: 1 });
  });

  it("should still work after spying the min", () => {
    queue.insert(2, { value: 2 });
    expect(queue.findMin()).toEqual({ value: 2 });
    queue.insert(3, { value: 3 });
    queue.insert(10, { value: 10 });
    queue.insert(104, { value: 104 });
    expect(queue.findMin()).toEqual({ value: 2 });
    queue.insert(1, { value: 1 });
    queue.insert(1210, { value: 1210 });
    queue.insert(101, { value: 101 });
    expect(queue.findMin()).toEqual({ value: 1 });
  });

  it("should still work after removing the min", () => {
    queue.insert(4, { value: 4 });
    queue.insert(3, { value: 3 });
    queue.insert(2, { value: 2 });
    queue.insert(1, { value: 1 });
    expect(queue.extractMin()).toEqual({ value: 1 });

    expect(queue.findMin()).toEqual({ value: 2 });
    expect(queue.min?.key).toEqual(2);
    expect(queue.min?.left?.child?.key).toEqual(4);
    expect(queue.min?.left?.key).toEqual(3);
    expect(queue.min?.right?.key).toEqual(3);
  });

  it("should still removing and Inserting multiple asc elements", () => {
    queue.insert(6, { value: 6 });
    queue.insert(12, { value: 12 });
    queue.insert(40, { value: 40 });
    queue.insert(45, { value: 45 });
    queue.insert(200, { value: 200 });

    expect(queue.extractMin()).toEqual({ value: 6 });
    expect(queue.extractMin()).toEqual({ value: 12 });
    expect(queue.extractMin()).toEqual({ value: 40 });
    expect(queue.extractMin()).toEqual({ value: 45 });
    expect(queue.extractMin()).toEqual({ value: 200 });
    expect(queue.extractMin()).toBeUndefined();
  });

  it("should still removing and Inserting multiple desc elements", () => {
    queue.insert(200, { value: 200 });
    queue.insert(40, { value: 40 });
    queue.insert(45, { value: 45 });
    queue.insert(12, { value: 12 });
    queue.insert(6, { value: 6 });

    expect(queue.extractMin()).toEqual({ value: 6 });
    expect(queue.extractMin()).toEqual({ value: 12 });
    expect(queue.extractMin()).toEqual({ value: 40 });
    expect(queue.extractMin()).toEqual({ value: 45 });
  });

  it("should still removing and Inserting multiple elements at random", () => {
    queue.insert(45, { value: 45 });
    queue.insert(12, { value: 12 });
    queue.insert(6, { value: 6 });
    queue.insert(40, { value: 40 });
    queue.insert(200, { value: 200 });

    expect(queue.extractMin()).toEqual({ value: 6 });
    expect(queue.extractMin()).toEqual({ value: 12 });
    expect(queue.extractMin()).toEqual({ value: 40 });
    expect(queue.extractMin()).toEqual({ value: 45 });
  });

  it("should still removing and Inserting multiple elements unsyc", () => {
    queue.insert(45, { value: 45 });
    queue.insert(12, { value: 12 });
    expect(queue.extractMin()).toEqual({ value: 12 });
    queue.insert(6, { value: 6 });
    expect(queue.extractMin()).toEqual({ value: 6 });
    queue.insert(40, { value: 40 });
    queue.insert(200, { value: 200 });

    expect(queue.extractMin()).toEqual({ value: 40 });
    expect(queue.extractMin()).toEqual({ value: 45 });
    expect(queue.extractMin()).toEqual({ value: 200 });

    queue.insert(9, { value: 9 });
    queue.insert(11, { value: 11 });
    queue.insert(5, { value: 5 });
    queue.insert(6, { value: 6 });
    queue.insert(15, { value: 15 });
    queue.insert(7, { value: 7 });
    queue.insert(8, { value: 8 });
    expect(queue.extractMin()).toEqual({ value: 5 });
    queue.insert(10, { value: 10 });
    queue.insert(1, { value: 1 });
    queue.insert(12, { value: 12 });
    queue.insert(2, { value: 2 });
    queue.insert(4, { value: 4 });
    queue.insert(3, { value: 3 });
    queue.insert(14, { value: 14 });
    queue.insert(13, { value: 13 });
    queue.insert(16, { value: 16 });
    queue.insert(17, { value: 17 });

    expect(queue.extractMin()).toEqual({ value: 1 });

    queue.insert(100, { value: 100 });
    queue.insert(101, { value: 101 });
    queue.insert(102, { value: 102 });
    queue.insert(103, { value: 103 });
    queue.insert(104, { value: 104 });
    queue.insert(105, { value: 105 });
    queue.insert(106, { value: 106 });
    queue.insert(107, { value: 107 });
    queue.insert(108, { value: 108 });
    queue.insert(109, { value: 109 });
    queue.insert(110, { value: 110 });
    queue.insert(111, { value: 111 });
    queue.insert(112, { value: 112 });
    queue.insert(113, { value: 113 });
    queue.insert(114, { value: 114 });

    expect(queue.extractMin()).toEqual({ value: 2 });
    expect(queue.extractMin()).toEqual({ value: 3 });
    expect(queue.extractMin()).toEqual({ value: 4 });
    expect(queue.extractMin()).toEqual({ value: 6 });
    expect(queue.extractMin()).toEqual({ value: 7 });
    expect(queue.extractMin()).toEqual({ value: 8 });
    expect(queue.extractMin()).toEqual({ value: 9 });
    expect(queue.extractMin()).toEqual({ value: 10 });
    expect(queue.extractMin()).toEqual({ value: 11 });
  });
});
