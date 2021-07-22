/* eslint-disable unused-imports/no-unused-vars */
import { AjaxMetadata } from "common/utils/ajax";
import { mockNetworkSleep } from "common/utils/mockUtils";
import { sleep } from "common/utils/sleep";
import { SystemEventsExternalApi } from "common/backend/systemEvents";
import {
  ComponentTypeEnum,
  SystemEventsApiResult,
  SystemUpdateInternalApiPayloadType,
  SystemUpdateInternalApiType,
  SystemUpdatesExternalResult,
} from "common/backend/systemEvents/_types/systemEventsTypes";
import { loggerCreator } from "common/utils/logger";

const moduleLogger = loggerCreator(__filename);

export class SystemEventsExternalApiMock implements SystemEventsExternalApi {
  async listSystemUpdates(metadata: AjaxMetadata): Promise<SystemUpdatesExternalResult> {
    await sleep(mockNetworkSleep);

    return {
      updates: [
        {
          updateId: "bef43724-0c8b-4f8c-a688-5e87eaa88a21",
          startTimeEpoch: 1593595619,
          startTime: "1970-01-19_10:39:55",
          endTimeEpoch: 1593602819,
          endTime: "1970-01-19_10:40:02",
          component: ComponentTypeEnum.QCP_VERSION,
          method: "scheduled",
          expectedEffect: "No effect",
          description: "QCP Agent upgrade",
          metaData: {
            deliveryServices: [],
          },
        },
        {
          updateId: "8a9ef18a-28a3-4ab5-a54e-1d83301d3ec6",
          startTimeEpoch: 1593595619,
          startTime: "1970-01-19_10:39:55",
          endTimeEpoch: 1593602819,
          endTime: "1970-01-19_10:40:02",
          component: ComponentTypeEnum.QCP_VERSION,
          method: "scheduled",
          expectedEffect: "No effect",
          description: "QCP Agent upgrade",
          metaData: {
            deliveryServices: [],
          },
        },
        {
          updateId: "995041bc-481f-4101-9aac-11f95c4c947f",
          startTimeEpoch: 1594644464,
          startTime: "1970-01-19_10:57:24",
          endTimeEpoch: 1594648064,
          endTime: "1970-01-19_10:57:28",
          component: ComponentTypeEnum.QCP_CONFIGURATION,
          method: "scheduled",
          expectedEffect: "No expected effect on end users or network",
          description: "Hello!",
          metaData: {
            deliveryServices: [],
          },
        },
        {
          updateId: "848ac5d0-4c8f-431e-9078-a20947d41874",
          startTimeEpoch: 1597043800,
          startTime: "1970-01-19_11:37:23",
          endTimeEpoch: 1597051000,
          endTime: "1970-01-19_11:37:31",
          component: ComponentTypeEnum.QCP_VERSION,
          method: "scheduled",
          expectedEffect: "No effect",
          description: "QCP Agent upgrade",
          metaData: {
            deliveryServices: [],
          },
        },
        {
          updateId: "7c86ab79-369e-455a-bf17-ac176d3a8059",
          startTimeEpoch: 1597044000,
          startTime: "1970-01-19_11:37:24",
          endTimeEpoch: 1597051200,
          endTime: "1970-01-19_11:37:31",
          component: ComponentTypeEnum.QCP_VERSION,
          method: "scheduled",
          expectedEffect: "No effect",
          description: "QCP Agent upgrade",
          metaData: {
            deliveryServices: [],
          },
        },
      ],
    };
  }

  async updateSystemUpdates(
    id: string,
    entity: SystemUpdateInternalApiPayloadType
  ): Promise<SystemUpdateInternalApiType> {
    await sleep(mockNetworkSleep);
    moduleLogger.debug("Mock update, id: " + id);
    moduleLogger.debug(JSON.stringify(entity));

    return { ...entity, updateId: id };
  }

  async createSystemUpdate(entity: SystemUpdateInternalApiPayloadType): Promise<SystemUpdateInternalApiType> {
    await sleep(mockNetworkSleep);
    moduleLogger.debug("Mock create: ");
    moduleLogger.debug(JSON.stringify(entity));

    return { ...entity, updateId: "bef53724-0c8b-4f8c-a688-5e87eaa88a21" };
  }

  async deleteSystemUpdate(id: string) {
    await sleep(mockNetworkSleep);
    moduleLogger.debug("Mock delete: " + id);
  }

  async listSystemEvents(metadata: AjaxMetadata): Promise<SystemEventsApiResult> {
    await sleep(mockNetworkSleep);

    return {
      events: [
        {
          updateId: "902af79c-5f0c-4d0f-b76d-45c788bd344b",
          eventId: "eventId0",
          systemId: "systemId0",
          timestampEpoch: 1593595619,
          component: ComponentTypeEnum.QCP_VERSION,
          updateMethod: "scheduled",
          expectedEffect: "No effect 1",
          description: "Event Description",
          location: "mockLocation",
          qnName: "QN-0",
          timestamp: "2020-07-1 09:26",
          metaData: {
            deliveryServices: [
              {
                name: "mockDs-ds",
              },
            ],
          },
        },
        {
          updateId: "bef43724-0c8b-4f8c-a688-5e87eaa88a21",
          eventId: "eventId1",
          systemId: "systemId1",
          timestampEpoch: 1593595719,
          component: ComponentTypeEnum.QCP_VERSION,
          updateMethod: "scheduled",
          expectedEffect: "No effect",
          description: "Event Description",
          location: "mockLocation",
          qnName: "QN-1",
          timestamp: "2020-07-1 09:28",
          metaData: {
            deliveryServices: [
              {
                name: "mockDs-ds",
              },
            ],
          },
        },
      ],
    };
  }
  //region [[ Singleton ]]
  protected static _instance: SystemEventsExternalApiMock | undefined;
  static get instance(): SystemEventsExternalApiMock {
    if (!this._instance) {
      this._instance = new SystemEventsExternalApiMock();
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
