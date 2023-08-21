import FibonacciHeap, { FibNode } from "./index";

describe("Fibonacci heap private methods", () => {
  class FibonacciHeapExtended extends FibonacciHeap {
    constructor() {
      super();
    }

    _removeFromListExtend(arg: FibNode) {
      this._removeFromList(arg);
    }

    _mergeListsExtend(...args: [FibNode, FibNode]) {
      return this._mergeLists(...args);
    }

    _consolidateExtend() {
      this._consolidate();
    }

    _linkHeapsExtend(...args: [FibNode, FibNode]) {
      return this._linkHeaps(...args);
    }
  }

  let queue: FibonacciHeapExtended;
  let root: FibNode;
  let root2: FibNode;

  beforeEach(() => {
    queue = new FibonacciHeapExtended();

    root = new FibNode(1);
    const node2 = new FibNode(2);
    const node3 = new FibNode(3);

    root.left = node2;
    node2.left = node3;
    node3.left = root;
    root.right = node3;
    node3.right = node2;
    node2.right = root;

    root2 = new FibNode(4);
    const node2_2 = new FibNode(5);
    const node3_2 = new FibNode(6);

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
    const node = new FibNode(10);
    node.left = node;
    node.right = node;
    const temp = queue._mergeListsExtend(root, node);

    expect(temp!.key).toBe(1);
    expect(temp!.left?.key).toBe(10);
    expect(temp!.left?.left?.key).toBe(2);
    expect(temp!.right?.right?.right?.key).toBe(10);
  });

  test("_linkHeaps", () => {
    const child = new FibNode(10);
    child.left = child;
    child.right = child;

    const resp = queue._linkHeapsExtend(child, root);

    expect(root).toBe(resp);
    expect(resp.child).toBe(child);
    expect(root.child?.key).toBe(10);
  });

  test("_linkHeaps 2 ", () => {
    const child = new FibNode(10);
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
    queue.insert(1);
    queue.insert(2);
    queue.insert(3);
    queue.insert(4);

    queue._consolidateExtend();
    expect(queue.findMin()).toBe(1);
    expect(queue.min.left?.key).toBe(1);
    expect(queue.min.right?.key).toBe(1);

    expect(queue.min.child?.key).toBe(2);
    expect(queue.min.child?.left?.key).toBe(4);
    expect(queue.min.child?.right?.key).toBe(4);
    expect(queue.min.child?.child?.key).toBe(3);
  });
});
describe("Fibonacci Heap functions", () => {
  let queue: FibonacciHeap;

  beforeEach(() => {
    queue = new FibonacciHeap();
  });

  it("Should insert correctly", () => {
    queue.insert(1);
    queue.insert(2);
    queue.insert(3);
    queue.insert(4);
    queue.insert(5);
    expect(queue.findMin()).toBe(1);
    expect(queue.min.left?.key).toBe(5);
    expect(queue.min.left?.left?.key).toBe(4);
    expect(queue.min.left?.left?.left?.key).toBe(3);
    expect(queue.min.left?.left?.left?.left?.key).toBe(2);
    expect(queue.min.right?.key).toBe(2);
  });

  it("should check the min correctly", () => {
    queue.insert(1);
    expect(queue.findMin()).toEqual(1);
  });

  it("should extract the min correctly", () => {
    queue.insert(2);
    queue.insert(1);
    expect(queue.findMin()).toEqual(1);
    expect(queue.extractMin()).toEqual(1);
  });

  it("should still work after spying the min", () => {
    queue.insert(2);
    expect(queue.findMin()).toEqual(2);
    queue.insert(3);
    queue.insert(10);
    queue.insert(104);
    expect(queue.findMin()).toEqual(2);
    queue.insert(1);
    queue.insert(1210);
    queue.insert(101);
    expect(queue.findMin()).toEqual(1);
  });

  it("should still work after removing the min", () => {
    queue.insert(4);
    queue.insert(3);
    queue.insert(2);
    queue.insert(1);
    expect(queue.extractMin()).toEqual(1);

    expect(queue.findMin()).toEqual(2);
    expect(queue.min.key).toEqual(2);
    expect(queue.min.left?.key).toEqual(3);
    expect(queue.min.right?.key).toEqual(4);
  });

  it("Removing and Inserting multiple asc elements", () => {
    queue.insert(6);
    queue.insert(12);
    queue.insert(40);
    queue.insert(45);
    queue.insert(200);

    expect(queue.extractMin()).toEqual(6);
    expect(queue.extractMin()).toEqual(12);
    expect(queue.extractMin()).toEqual(40);
    expect(queue.extractMin()).toEqual(45);
  });

  it("Removing and Inserting multiple desc elements", () => {
    queue.insert(200);
    queue.insert(40);
    queue.insert(45);
    queue.insert(12);
    queue.insert(6);

    expect(queue.extractMin()).toEqual(6);
    expect(queue.extractMin()).toEqual(12);
    expect(queue.extractMin()).toEqual(40);
    expect(queue.extractMin()).toEqual(45);
  });

  it("Removing and Inserting multiple elements at random", () => {
    queue.insert(45);
    queue.insert(12);
    queue.insert(6);
    queue.insert(40);
    queue.insert(200);

    expect(queue.extractMin()).toEqual(6);
    expect(queue.extractMin()).toEqual(12);
    expect(queue.extractMin()).toEqual(40);
    expect(queue.extractMin()).toEqual(45);
  });
});
