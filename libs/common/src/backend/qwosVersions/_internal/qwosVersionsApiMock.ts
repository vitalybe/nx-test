import { sleep } from "common/utils/sleep";
import { ServerApiType } from "common/backend/trafficRoutersMonitors/_types/trafficRoutersMonitorsTypes";
import { loggerCreator } from "common/utils/logger";
import { mockNetworkSleep } from "common/utils/mockUtils";
import { QwosVersionsApi } from "./qwosVersionsApi";
import { QwosVersionsApiResult, SystemApiType } from "../_types/qwosVersionsTypes";
import { DeploymentEntitiesProvider } from "common/providers/deploymentEntitiesProvider";
import { AjaxMetadata } from "common/utils/ajax";

const moduleLogger = loggerCreator(__filename);

export class QwosVersionsApiMock implements QwosVersionsApi {
  async listSystems(): Promise<QwosVersionsApiResult> {
    await sleep(mockNetworkSleep);

    const qns = await DeploymentEntitiesProvider.instance.provideQns(new AjaxMetadata(), false, false, false);
    const versions = ["6.3.3.0-142059", "6.3.2.0-142007", "6.3.2.0-142007", "5.7.5.0-115177"];

    const systems: Record<string, SystemApiType> = {};

    qns.forEach((qn, index) => {
      systems[qn.name] = {
        qwosVersion: versions[index % versions.length],
      };
    });

    return { systems };
  }

  async updateServer(entity: ServerApiType) {
    await sleep(mockNetworkSleep);
    moduleLogger.debug("Mock update, id: " + entity.hostname);
    moduleLogger.debug(JSON.stringify(entity));
  }

  //region [[ Singleton ]]
  protected static _instance: QwosVersionsApiMock | undefined;
  static get instance(): QwosVersionsApiMock {
    if (!this._instance) {
      this._instance = new QwosVersionsApiMock();
    }

    return this._instance;
  }
  //endregion
}
