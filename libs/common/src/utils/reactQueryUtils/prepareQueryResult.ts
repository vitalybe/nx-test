import { loggerCreator } from "../logger";
import { useQuery, UseQueryOptions } from "react-query";
import { GlobalStore } from "common/stores/globalStore";
import { ReactQueryDependencyGraph } from "common/utils/reactQueryUtils/reactQueryDependencyGraph";
import stableStringify from "json-stable-stringify";
import { UseQueryResult } from "react-query/types/react/types";

const moduleLogger = loggerCreator(__filename);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PromiseFunction = (...args: any) => Promise<any>;

export type KeyType = [string, ...unknown[]];

export class PrepareQueryResult<T> {
  constructor(
    private data: {
      name: string;
      // Key will be composed of name and params. i.e. for providers, the arguments of the provide
      // function should usually go here.
      params?: unknown[];

      provide: (key: KeyType) => Promise<T>;
    }
  ) {
    Object.assign(this, data);
  }

  get key(): KeyType {
    return [this.data.name, ...(this.data.params ?? [])];
  }

  useQuery(queryOptions?: UseQueryOptions<T>): UseQueryResult<T> {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useQuery(this.key, () => this.data.provide(this.key), queryOptions);
  }

  // This will create a connection between the called key and the target key and will allow you to invalidate them
  // both easily.
  async fetchQueryAsDependency(calledFromKey: KeyType): Promise<T> {
    ReactQueryDependencyGraph.instance.addDependency(stableStringify(calledFromKey), stableStringify(this.key));
    return await this.fetchQuery();
  }

  // NOTE: when using from provider consider using fetchQueryAsDependency instead
  async fetchQuery(): Promise<T> {
    return await GlobalStore.instance.queryClient.fetchQuery(this.key, () => this.data.provide(this.key));
  }

  // Should be called when the data this provider holds is modified.
  // For example, when a user changes data of a provider (e.g. modifies cache)
  invalidateWithChildren() {
    ReactQueryDependencyGraph.instance.invalidateWithChildren(stableStringify(this.key));
  }

  // Should be called when the all the data behind this provider should be refreshed
  // For example, when a user requests to refresh a data in a tab
  invalidateWithChildrenAndParents() {
    ReactQueryDependencyGraph.instance.invalidateWithChildrenAndParents(stableStringify(this.key));
  }
}
