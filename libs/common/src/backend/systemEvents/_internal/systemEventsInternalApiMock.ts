/* eslint-disable unused-imports/no-unused-vars */
import { mockNetworkSleep } from "common/utils/mockUtils";
import { sleep } from "common/utils/sleep";
import { SystemEventsInternalApi } from "common/backend/systemEvents";
import {
  ComponentTypeEnum,
  SystemUpdateInternalApiPayloadType,
  SystemUpdatesInternalResult,
} from "common/backend/systemEvents/_types/systemEventsTypes";
import { loggerCreator } from "common/utils/logger";
import { AjaxMetadata } from "common/utils/ajax";

const moduleLogger = loggerCreator(__filename);

export class SystemEventsInternalApiMock implements SystemEventsInternalApi {
  async listSystemUpdates(metadata: AjaxMetadata): Promise<SystemUpdatesInternalResult> {
    await sleep(mockNetworkSleep);

    return {
      updates: [
        {
          updateId: "902af79c-5f0c-4d0f-b76d-45c788bd344b",
          startTimeEpoch: 1593595619,
          expectedDuration: 7200,
          lateArrivalDuration: 86400,
          component: ComponentTypeEnum.QCP_VERSION,
          method: "scheduled",
          expectedEffect: "No effect 1",
          exposure: "public",
          externalDescription: "QCP Agent upgrade",
          internalDescription: "fixing OSC-2235",
          metaData: {
            deliveryServices: null,
            qcp: [
              {
                version: "6.4.5",
              },
            ],
          },
          links: [],
          scope: [
            {
              scopeType: "qnDeployment",
              qnDeploymentScopeDetails: {
                ids: [60],
              },
            },
          ],
        },
        {
          updateId: "bef43724-0c8b-4f8c-a688-5e87eaa88a21",
          startTimeEpoch: 1593595619,
          expectedDuration: 7200,
          lateArrivalDuration: 86400,
          component: ComponentTypeEnum.QCP_VERSION,
          method: "scheduled",
          expectedEffect: "No effect",
          exposure: "public",
          externalDescription: "QCP Agent upgrade",
          internalDescription: "fixing OSC-2235",
          metaData: {
            deliveryServices: null,
            qcp: [
              {
                version: "6.4.5",
              },
            ],
          },
          links: [],
          scope: [
            {
              scopeType: "qnDeployment",
              qnDeploymentScopeDetails: {
                ids: [60],
              },
            },
          ],
        },
      ],
    };
  }
  async updateSystemUpdates(
    id: string,
    entity: SystemUpdateInternalApiPayloadType
  ): Promise<SystemUpdatesInternalResult> {
    await sleep(mockNetworkSleep);
    moduleLogger.debug("Mock update, id: " + id);
    moduleLogger.debug(JSON.stringify(entity));

    return { updates: [{ ...entity, updateId: id }] };
  }

  async createSystemUpdate(entity: SystemUpdateInternalApiPayloadType): Promise<SystemUpdatesInternalResult> {
    await sleep(mockNetworkSleep);
    moduleLogger.debug("Mock create: ");
    moduleLogger.debug(JSON.stringify(entity));

    return { updates: [{ ...entity, updateId: "bef53724-0c8b-4f8c-a688-5e87eaa88a21" }] };
  }

  async deleteSystemUpdate(id: string) {
    await sleep(mockNetworkSleep);
    moduleLogger.debug("Mock delete: " + id);
  }

  //region [[ Singleton ]]
  protected static _instance: SystemEventsInternalApiMock | undefined;
  static get instance(): SystemEventsInternalApiMock {
    if (!this._instance) {
      this._instance = new SystemEventsInternalApiMock();
    }

    return this._instance;
  }
  //endregion
}

//region [[ Mock config types ]]
interface SystemEventsApiMockConfig {
  sampleText: string;
}
//endregion
