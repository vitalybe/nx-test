import { observable } from "mobx";
import { loggerCreator } from "common/utils/logger";
import { QueryClient } from "react-query";
import { Duration } from "luxon";

const moduleLogger = loggerCreator(__filename);

export class GlobalStore {
  //function runs on experiments toolbar version selection
  @observable experimentsToolbarOnSelectionChange: () => void = () => {};
  @observable supportedQnsNames: string[] | undefined;

  queryClient: QueryClient = new QueryClient({
    // NOTE: if data is stale, it will re-fetch data only on request - NOT automatically
    // see here: https://react-query.tanstack.com/guides/important-defaults#_top
    defaultOptions: { queries: { staleTime: Duration.fromObject({ minute: 1 }).as("milliseconds"), retry: false } },
  });

  static createMock(): GlobalStore {
    return new GlobalStore();
  }

  //region [[ Singleton ]]
  private static _instance: GlobalStore | undefined;
  static get instance(): GlobalStore {
    if (!this._instance) {
      this._instance = new GlobalStore();
    }

    return this._instance;
  }

  private constructor() {}
}
