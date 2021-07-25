import { loggerCreator } from "common/utils/logger";
import { combineUrl } from "common/utils/combineUrl";
import { UrlParams } from "common/backend/_utils/urlParams";
import { Ajax, AjaxMetadata } from "common/utils/ajax";
import { devToolsStore } from "common/components/devTools/_stores/devToolsStore";
import { HealthReporterApiMock } from "common/backend/healthReporter";
import { HealthReporterApiResult } from "common/backend/healthReporter/_types/healthReporterTypes";
import { MockWrapperProxy } from "common/backend/_utils/mockWrapperProxy/mockWrapperProxy";

const moduleLogger = loggerCreator(__filename);
const ENDPOINT = "/publish/OperStatus";

export class HealthReporterApi {
  protected constructor() {}

  async getEntities(url: string, metadata: AjaxMetadata): Promise<HealthReporterApiResult> {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(url, ENDPOINT, params);

    const data = await Ajax.getJson(path, metadata);
    return data as HealthReporterApiResult;
  }

  //region [[ Singleton ]]
  protected static _instance: HealthReporterApi | undefined;
  static get instance(): HealthReporterApi {
    if (!this._instance) {
      const realApi = new HealthReporterApi();
      const mockApi = MockWrapperProxy.wrap(realApi, HealthReporterApiMock.instance);
      this._instance = !devToolsStore.isMockMode ? realApi : mockApi;
    }

    return this._instance;
  }
  //endregion
}
