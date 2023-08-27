import { BinaryHeap } from "./index";

describe("Binary Heap methods", () => {
  let queue: BinaryHeap<{ value: number }>;

  beforeEach(() => {
    queue = new BinaryHeap();
  });

  it("should insert values", () => {
    queue.insert(41, { value: 41 });
    queue.insert(39, { value: 39 });
    queue.insert(33, { value: 33 });
    queue.insert(18, { value: 18 });

    expect(queue.values).toEqual([
      { key: 18, value: { value: 18 } },
      { key: 33, value: { value: 33 } },
      { key: 39, value: { value: 39 } },
      { key: 41, value: { value: 41 } },
    ]);
  });

  it("should extract min values", () => {
    queue.insert(41, { value: 41 });
    queue.insert(39, { value: 39 });
    queue.insert(33, { value: 33 });
    queue.insert(18, { value: 18 });
    queue.insert(27, { value: 27 });
    queue.insert(12, { value: 12 });
    queue.insert(55, { value: 55 });

    expect(queue.extractMin()).toEqual({ value: 12 });
    expect(queue.extractMin()).toEqual({ value: 18 });
    expect(queue.extractMin()).toEqual({ value: 27 });
    expect(queue.extractMin()).toEqual({ value: 33 });
    expect(queue.extractMin()).toEqual({ value: 39 });
    expect(queue.extractMin()).toEqual({ value: 41 });
    expect(queue.extractMin()).toEqual({ value: 55 });
  });

  it("should work after inserting and extracting", () => {
    queue.insert(41, { value: 41 });
    queue.insert(39, { value: 39 });
    queue.insert(33, { value: 33 });
    queue.insert(18, { value: 18 });

    expect(queue.extractMin()).toEqual({ value: 18 });
    expect(queue.extractMin()).toEqual({ value: 33 });

    queue.insert(27, { value: 27 });
    queue.insert(12, { value: 12 });
    queue.insert(55, { value: 55 });

    expect(queue.extractMin()).toEqual({ value: 12 });
    expect(queue.extractMin()).toEqual({ value: 27 });
    expect(queue.extractMin()).toEqual({ value: 39 });
    expect(queue.extractMin()).toEqual({ value: 41 });
    expect(queue.extractMin()).toEqual({ value: 55 });
  });

  it("should decrease key", () => {
    queue.insert(27, { value: 27 });
    queue.insert(12, { value: 12 });
    const payload = { value: 55 };
    queue.insert(55, payload);

    const index = queue.values.findIndex((node) => node.value == payload);

    queue.decreaseKey(index, 10);

    expect(queue.extractMin()).toEqual({ value: 55 });

    queue.insert(41, { value: 41 });

    const index2 = queue.values.findIndex((node) => node.value.value === 41);
    queue.decreaseKey(index2, 1, { value: 41 });

    expect(queue.extractMin()).toEqual({ value: 41 });
  });
});
