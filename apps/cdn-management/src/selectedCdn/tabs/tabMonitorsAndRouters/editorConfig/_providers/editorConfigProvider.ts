import { loggerCreator } from "@qwilt/common/utils/logger";
import { PrepareQueryResult } from "@qwilt/common/utils/reactQueryUtils/prepareQueryResult";
import { TrafficRoutersMonitorsApi } from "@qwilt/common/backend/trafficRoutersMonitors";

// noinspection JSUnusedLocalSymbols
const moduleLogger = loggerCreator("__filename");

export class EditorConfigProvider {
  private constructor() {}

  prepareQuery(cdnName: string, mode: "routers" | "monitors"): PrepareQueryResult<object> {
    return new PrepareQueryResult<object>({
      name: "EditorConfigProvider.prepareQuery",
      // eslint-disable-next-line prefer-rest-params
      params: [...arguments],
      provide: async () => {
        return await TrafficRoutersMonitorsApi.instance.getConfig(mode, cdnName);
      },
    });
  }

  //region [[ Singleton ]]
  private static _instance: EditorConfigProvider | undefined;
  static get instance(): EditorConfigProvider {
    if (!this._instance) {
      this._instance = new EditorConfigProvider();
    }

    return this._instance;
  }
  //endregion
}
