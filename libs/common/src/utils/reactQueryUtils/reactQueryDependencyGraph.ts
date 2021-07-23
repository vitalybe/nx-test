import Graph from "graph-data-structure";

import { loggerCreator } from "../logger";
import { GlobalStore } from "../../stores/globalStore";

const moduleLogger = loggerCreator("__filename");

export class ReactQueryDependencyGraph {
  private dependenciesGraph = Graph();

  addDependency(fromKey: string, toKey: string) {
    this.dependenciesGraph.addEdge(fromKey, toKey);
    if (this.dependenciesGraph.hasCycle()) {
      throw new Error(`Cycle detected when adding dependency: ${fromKey} -> ${toKey}`);
    }
  }

  invalidateWithChildren(key: string) {
    moduleLogger.debug("Invalidating with children: " + key);
    const children = this.listChildren(key);

    for (const invalidatedKey of [key, ...children]) {
      this.invalidate(invalidatedKey);
    }
  }

  invalidateWithChildrenAndParents(key: string) {
    moduleLogger.debug("Invalidating with parents and children: " + key);

    const parents = this.dependenciesGraph.depthFirstSearch([key], false);
    const children = this.listChildren(key);
    // when a parent gets invalidated its children will also must be invalidated
    const childrenOfParents = parents.flatMap((parent) => this.listChildren(parent));

    const invalidationsList = this.orderByTopology([...parents, key, ...children, ...childrenOfParents]);
    // If the requested invalidation doesn't have any dependency, it will not return from orderByTopology but we must invalidate
    // it anyway.
    if (!invalidationsList.length) {
      invalidationsList.push(key);
    }

    for (const invalidatedKey of invalidationsList) {
      this.invalidate(invalidatedKey);
    }
  }

  // Returns topological list of children of targetKey. Sorted from parents to children for invalidation.
  private listChildren(targetKey: string) {
    const topologicalList = this.dependenciesGraph.topologicalSort();
    const childrenSet = new Set<string>([]);

    for (const key of topologicalList) {
      if (key === targetKey) {
        // Reached target item - Everything beyond that can't be child since graph is sorted topologically
        break;
      }
      if (childrenSet.has(key)) {
        // Already recorcded as valid child
        continue;
      }

      for (const pathItem of this.shortestPath(key, targetKey)) {
        // We don't want to include the target item in the list of results
        if (pathItem === targetKey) {
          continue;
        }

        childrenSet.add(pathItem);
      }
    }

    // Include only valid children - Ones that actually lead to the target
    return this.orderByTopology([...childrenSet]);
  }

  private orderByTopology(keysToOrder: string[]) {
    const keysToOrderSet = new Set(keysToOrder);
    const topologicalList = this.dependenciesGraph.depthFirstSearch();
    return topologicalList.filter((item) => keysToOrderSet.has(item));
  }

  private shortestPath(key1: string, key2: string) {
    try {
      return this.dependenciesGraph.shortestPath(key1, key2);
    } catch {
      return [];
    }
  }

  // NOTE: Don't use directly - Overridden by tests
  static invalidateRaw(invalidatedKey: string) {
    moduleLogger.debug("Invalidating: " + invalidatedKey);
    GlobalStore.instance.queryClient.resetQueries(JSON.parse(invalidatedKey), { exact: true });
  }

  //region [[ Singleton ]]
  constructor(private readonly invalidate: (key: string) => void = ReactQueryDependencyGraph.invalidateRaw) {}

  private static _instance: ReactQueryDependencyGraph | undefined;
  static get instance(): ReactQueryDependencyGraph {
    if (!this._instance) {
      this._instance = new ReactQueryDependencyGraph();
    }

    return this._instance;
  }
  //endregion
}
