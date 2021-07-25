/* eslint-disable no-console */
import { ReactQueryDependencyGraph } from "./reactQueryDependencyGraph";

describe("reactQueryDependencyGraph", function () {
  describe("invalidateWithChildrenAndParents", function () {
    it("should invalidate a1 in a1 -> b1", function () {
      const invalidations: string[] = [];
      const reactQueryDependencyGraph = new ReactQueryDependencyGraph((key) => invalidations.push(key));

      reactQueryDependencyGraph.addDependency("a1", "b1");
      reactQueryDependencyGraph.invalidateWithChildrenAndParents("a1");

      expect(invalidations.length).toEqual(2);
      expect(invalidations.includes("a1"));
      expect(invalidations.includes("b1"));

      // Parent must be invalidated before child
      expect(invalidations.indexOf("b1")).toBeLessThan(invalidations.indexOf("a1"));
    });

    it("should invalidate b1 in a1 -> b1 -> c1", function () {
      // Invalidating b1:
      // c layer is expected to invalidate first
      // b layer second
      // a last

      const invalidations: string[] = [];
      const reactQueryDependencyGraph = new ReactQueryDependencyGraph((key) => invalidations.push(key));

      reactQueryDependencyGraph.addDependency("a1", "b1");
      reactQueryDependencyGraph.addDependency("b1", "c1");
      reactQueryDependencyGraph.invalidateWithChildrenAndParents("b1");

      expect(invalidations.length).toEqual(3);
      expect(invalidations.includes("a1"));
      expect(invalidations.includes("b1"));
      expect(invalidations.includes("c1"));

      // Parent must be invalidated before child
      expect(invalidations.indexOf("c1")).toBeLessThan(invalidations.indexOf("b1"));
      expect(invalidations.indexOf("b1")).toBeLessThan(invalidations.indexOf("a1"));
    });

    it("should invalidate a1 in a1 -> (b1, b2)", function () {
      // Invalidating a1:
      // b layer is expected to invalidate first
      // a layer second

      const invalidations: string[] = [];
      const reactQueryDependencyGraph = new ReactQueryDependencyGraph((key) => invalidations.push(key));

      reactQueryDependencyGraph.addDependency("a1", "b1");
      reactQueryDependencyGraph.addDependency("a1", "b2");
      reactQueryDependencyGraph.invalidateWithChildrenAndParents("a1");

      expect(invalidations.length).toEqual(3);
      expect(invalidations.includes("a1"));
      expect(invalidations.includes("b1"));
      expect(invalidations.includes("b2"));

      // Parent must be invalidated before child
      expect(invalidations.indexOf("b2")).toBeLessThan(invalidations.indexOf("a1"));
      expect(invalidations.indexOf("b1")).toBeLessThan(invalidations.indexOf("a1"));
    });

    it("should invalidate a1 in (a1, a2) -> b1", function () {
      // Invalidating a1:
      // b layer is expected to invalidate first
      // a layer second, including the sibling of a - a2

      const invalidations: string[] = [];
      const reactQueryDependencyGraph = new ReactQueryDependencyGraph((key) => invalidations.push(key));

      reactQueryDependencyGraph.addDependency("a1", "b1");
      reactQueryDependencyGraph.addDependency("a2", "b1");
      reactQueryDependencyGraph.invalidateWithChildrenAndParents("a1");

      expect(invalidations.length).toEqual(3);
      expect(invalidations.includes("a1"));
      expect(invalidations.includes("a2"));
      expect(invalidations.includes("b1"));

      // Parent must be invalidated before child
      expect(invalidations.indexOf("b1")).toBeLessThan(invalidations.indexOf("a1"));
      expect(invalidations.indexOf("b1")).toBeLessThan(invalidations.indexOf("a2"));
    });

    it("should invalidate b1 with a sibling and 2 parent layers", function () {
      // Invalidating b1:
      // c layer is expected to invalidate first
      // b layer second
      // a layer last
      //
      //            +----+
      //            | a1 |
      //            +----+
      //              |
      //              |
      //              v
      // +----+     +----+     +----+
      // | a2 | --> | b1 | --> | c1 |
      // +----+     +----+     +----+
      //              |
      //              |
      //              v
      //            +----+
      //            | c2 |
      //            +----+

      const invalidations: string[] = [];
      const reactQueryDependencyGraph = new ReactQueryDependencyGraph((key) => invalidations.push(key));

      reactQueryDependencyGraph.addDependency("a1", "b1");
      reactQueryDependencyGraph.addDependency("a2", "b1");
      reactQueryDependencyGraph.addDependency("b1", "c1");
      reactQueryDependencyGraph.addDependency("b1", "c2");

      reactQueryDependencyGraph.invalidateWithChildrenAndParents("b1");

      expect(invalidations.length).toEqual(5);
      expect(invalidations.includes("a1"));
      expect(invalidations.includes("a2"));
      expect(invalidations.includes("b1"));
      expect(invalidations.includes("c1"));
      expect(invalidations.includes("c2"));

      // Parent must be invalidated before child
      expect(invalidations.indexOf("c1")).toBeLessThan(invalidations.indexOf("b1"));
      expect(invalidations.indexOf("c2")).toBeLessThan(invalidations.indexOf("b1"));
      expect(invalidations.indexOf("b1")).toBeLessThan(invalidations.indexOf("a1"));
      expect(invalidations.indexOf("b1")).toBeLessThan(invalidations.indexOf("a2"));
    });

    it("should invalidate b1 - mid item with parents AND children", function () {
      // Invalidating b1. Should happen in following order:
      // d layer (parent)
      // c layer (parent)
      // b layer (self)
      // a layer (child)
      //            +----+
      //            | a1 | -+
      //            +----+  |
      //              |     |
      //              |     |
      //              v     |
      //            +----+  |
      //            | b1 |  |
      //            +----+  |
      //              |     |
      //              |     |
      //              v     |
      // +----+     +----+  |
      // | d2 | <-- | c1 | <+
      // +----+     +----+
      //              |
      //              |
      //              v
      //            +----+
      //            | d1 |
      //            +----+

      const invalidations: string[] = [];
      const reactQueryDependencyGraph = new ReactQueryDependencyGraph((key) => invalidations.push(key));

      reactQueryDependencyGraph.addDependency("a1", "b1");
      reactQueryDependencyGraph.addDependency("a1", "c1");
      reactQueryDependencyGraph.addDependency("b1", "c1");
      reactQueryDependencyGraph.addDependency("c1", "d1");
      reactQueryDependencyGraph.addDependency("c1", "d2");
      reactQueryDependencyGraph.invalidateWithChildrenAndParents("b1");

      expect(invalidations.length).toEqual(5);
      expect(invalidations.includes("a1"));
      expect(invalidations.includes("b1"));
      expect(invalidations.includes("c1"));
      expect(invalidations.includes("d1"));
      expect(invalidations.includes("d2"));

      // Parent must be invalidated before child
      expect(invalidations.indexOf("d1")).toBeLessThan(invalidations.indexOf("c1"));
      expect(invalidations.indexOf("d2")).toBeLessThan(invalidations.indexOf("c1"));
      expect(invalidations.indexOf("c1")).toBeLessThan(invalidations.indexOf("b1"));
      expect(invalidations.indexOf("b1")).toBeLessThan(invalidations.indexOf("a1"));
    });
  });

  describe("invalidateWithChildren", function () {
    it("should invalidate b1 in a1 -> b1", function () {
      const invalidations: string[] = [];
      const reactQueryDependencyGraph = new ReactQueryDependencyGraph((key) => invalidations.push(key));

      reactQueryDependencyGraph.addDependency("a1", "b1");
      reactQueryDependencyGraph.invalidateWithChildren("b1");

      console.log("Invalidation order");
      console.log(invalidations);

      expect(invalidations.length).toEqual(2);
      expect(invalidations.includes("a1"));
      expect(invalidations.includes("b1"));

      // Parent must be invalidated before child
      expect(invalidations.indexOf("b1")).toBeLessThan(invalidations.indexOf("a1"));
    });

    it("should invalidate c1 in a1 -> b1 -> c1", function () {
      // Invalidating a1:
      // c layer is expected to invalidate first
      // b layer second
      // a last

      const invalidations: string[] = [];
      const reactQueryDependencyGraph = new ReactQueryDependencyGraph((key) => invalidations.push(key));

      reactQueryDependencyGraph.addDependency("a1", "b1");
      reactQueryDependencyGraph.addDependency("b1", "c1");
      reactQueryDependencyGraph.invalidateWithChildren("c1");

      expect(invalidations.length).toEqual(3);
      expect(invalidations.includes("a1"));
      expect(invalidations.includes("b1"));
      expect(invalidations.includes("c1"));

      // Parent must be invalidated before child
      expect(invalidations.indexOf("c1")).toBeLessThan(invalidations.indexOf("b1"));
      expect(invalidations.indexOf("b1")).toBeLessThan(invalidations.indexOf("a1"));
    });

    it("should invalidate b1 in a1 -> (b1, b2)", function () {
      // Invalidating b1. Will invalidate in this order:
      // b1 - Alone. b2 is not included since it is brother
      // a layer

      const invalidations: string[] = [];
      const reactQueryDependencyGraph = new ReactQueryDependencyGraph((key) => invalidations.push(key));

      reactQueryDependencyGraph.addDependency("a1", "b1");
      reactQueryDependencyGraph.addDependency("a1", "b2");
      reactQueryDependencyGraph.invalidateWithChildren("b1");

      expect(invalidations.length).toEqual(2);
      expect(invalidations.includes("a1"));
      expect(invalidations.includes("b1"));

      // Parent must be invalidated before child
      expect(invalidations.indexOf("b1")).toBeLessThan(invalidations.indexOf("a1"));
    });

    it("should invalidate c2 with a sibling and 2 children layers", function () {
      // Invalidating c2:
      // c layer is expected to invalidate first (but without c1)
      // b layer second
      // a layer last
      //
      //            +----+
      //            | a1 |
      //            +----+
      //              |
      //              |
      //              v
      // +----+     +----+     +----+
      // | a2 | --> | b1 | --> | c1 |
      // +----+     +----+     +----+
      //              |
      //              |
      //              v
      //            +----+
      //            | c2 |
      //            +----+

      const invalidations: string[] = [];
      const reactQueryDependencyGraph = new ReactQueryDependencyGraph((key) => invalidations.push(key));

      reactQueryDependencyGraph.addDependency("a1", "b1");
      reactQueryDependencyGraph.addDependency("a2", "b1");
      reactQueryDependencyGraph.addDependency("b1", "c1");
      reactQueryDependencyGraph.addDependency("b1", "c2");

      reactQueryDependencyGraph.invalidateWithChildren("c2");

      expect(invalidations.length).toEqual(4);
      expect(invalidations.includes("a1"));
      expect(invalidations.includes("a2"));
      expect(invalidations.includes("b1"));
      expect(invalidations.includes("c2"));

      // Parent must be invalidated before child
      expect(invalidations.indexOf("c2")).toBeLessThan(invalidations.indexOf("b1"));
      expect(invalidations.indexOf("b1")).toBeLessThan(invalidations.indexOf("a1"));
      expect(invalidations.indexOf("b1")).toBeLessThan(invalidations.indexOf("a2"));
    });

    it("should invalidate c1 - mid item with parents AND children", function () {
      // Invalidating c1. Should happen in following order:
      // c layer (parent)
      // b layer (self)
      // a layer (child)
      //            +----+
      //            | a1 | -+
      //            +----+  |
      //              |     |
      //              |     |
      //              v     |
      //            +----+  |
      //            | b1 |  |
      //            +----+  |
      //              |     |
      //              |     |
      //              v     |
      // +----+     +----+  |
      // | d2 | <-- | c1 | <+
      // +----+     +----+
      //              |
      //              |
      //              v
      //            +----+
      //            | d1 |
      //            +----+

      const invalidations: string[] = [];
      const reactQueryDependencyGraph = new ReactQueryDependencyGraph((key) => invalidations.push(key));

      reactQueryDependencyGraph.addDependency("a1", "b1");
      reactQueryDependencyGraph.addDependency("a1", "c1");
      reactQueryDependencyGraph.addDependency("b1", "c1");
      reactQueryDependencyGraph.addDependency("c1", "d1");
      reactQueryDependencyGraph.addDependency("c1", "d2");
      reactQueryDependencyGraph.invalidateWithChildren("c1");

      expect(invalidations.length).toEqual(3);
      expect(invalidations.includes("a1"));
      expect(invalidations.includes("b1"));
      expect(invalidations.includes("c1"));

      // Parent must be invalidated before child
      expect(invalidations.indexOf("c1")).toBeLessThan(invalidations.indexOf("b1"));
      expect(invalidations.indexOf("b1")).toBeLessThan(invalidations.indexOf("a1"));
    });

    it("should invalidate c1 - sibling c2 should not be invalidated", function () {
      // Invalidating a1. Should happen in following order:
      // c layer (parent) - excluding c2
      // b layer (self)
      // a layer (child)
      //            +----+
      //            | a1 | ------------+
      //            +----+             |
      //              |                |
      //              |                |
      //              v                |
      // +----+     +----+     +----+  |
      // | a2 | --> | b1 | --> | c2 |  |
      // +----+     +----+     +----+  |
      //              |                |
      //              |                |
      //              v                |
      //            +----+             |
      //            | c1 | <-----------+
      //            +----+

      const invalidations: string[] = [];
      const reactQueryDependencyGraph = new ReactQueryDependencyGraph((key) => invalidations.push(key));

      reactQueryDependencyGraph.addDependency("a1", "b1");
      reactQueryDependencyGraph.addDependency("a2", "b1");
      reactQueryDependencyGraph.addDependency("b1", "c2");
      reactQueryDependencyGraph.addDependency("a1", "c1");
      reactQueryDependencyGraph.addDependency("b1", "c1");
      reactQueryDependencyGraph.addDependency("a1", "c1");
      reactQueryDependencyGraph.invalidateWithChildren("c1");

      expect(invalidations.length).toEqual(4);
      expect(invalidations.includes("a1"));
      expect(invalidations.includes("a2"));
      expect(invalidations.includes("b1"));
      expect(invalidations.includes("c1"));

      // Parent must be invalidated before child
      expect(invalidations.indexOf("c1")).toBeLessThan(invalidations.indexOf("b1"));
      expect(invalidations.indexOf("b1")).toBeLessThan(invalidations.indexOf("a1"));
      expect(invalidations.indexOf("b1")).toBeLessThan(invalidations.indexOf("a2"));
    });
  });
});
