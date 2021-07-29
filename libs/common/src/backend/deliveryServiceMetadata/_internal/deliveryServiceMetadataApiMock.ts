/* eslint-disable unused-imports/no-unused-vars */
import { mockNetworkSleep } from "common/utils/mockUtils";
import { sleep } from "common/utils/sleep";
import { loggerCreator } from "common/utils/logger";
import { DeliveryServiceMetadataApi } from "common/backend/deliveryServiceMetadata/_internal/deliveryServiceMetadataApi";
import {
  DeliveryServiceMetadataApiResult,
  DeliveryServiceMetadataCreateApiType,
  DeliveryServiceMetadataEditApiType,
  DeliveryServiceMetadataIconType,
  MetadataServiceTypeEnum,
} from "common/backend/deliveryServices/_types/deliveryServiceMetadataTypes";

const moduleLogger = loggerCreator(__filename);

export class DeliveryServiceMetadataApiMock implements DeliveryServiceMetadataApi {
  async getMetadata(): Promise<DeliveryServiceMetadataApiResult> {
    await sleep(mockNetworkSleep);

    return {
      metadataId: "1234",
      contentGroupId: 1234,
      ownerOrgId: "disney-plus",
      type: MetadataServiceTypeEnum.LIVE,
      reportingName: "disney-plus-live-delivery-service",
      userFriendlyName: "Disney Plus Live Delivery Service",
      delegationTargets: ["dlt1", "dlt2"],
    };
  }

  async list(): Promise<DeliveryServiceMetadataApiResult[]> {
    await sleep(mockNetworkSleep);

    return [];
  }

  async update(id: string, entity: DeliveryServiceMetadataEditApiType) {
    await sleep(mockNetworkSleep);
    moduleLogger.debug("Mock update, id: " + id);
    moduleLogger.debug(JSON.stringify(entity));
    return entity as DeliveryServiceMetadataApiResult;
  }

  async create(entity: DeliveryServiceMetadataCreateApiType) {
    await sleep(mockNetworkSleep);
    moduleLogger.debug("Mock create: ");
    moduleLogger.debug(JSON.stringify(entity));
    return {} as DeliveryServiceMetadataApiResult;
  }

  async delete(id: string) {
    await sleep(mockNetworkSleep);
    moduleLogger.debug("Mock delete: " + id);
  }

  async updateIcon(id: string, entity: DeliveryServiceMetadataIconType) {
    await sleep(mockNetworkSleep);
    moduleLogger.debug("Mock update, id: " + id);
    moduleLogger.debug(JSON.stringify(entity));
  }

  async getIcon(): Promise<DeliveryServiceMetadataIconType> {
    await sleep(mockNetworkSleep);

    return {
      iconData: "base64string",
    };
  }

  //region [[ Singleton ]]
  protected static _instance: DeliveryServiceMetadataApiMock | undefined;
  static get instance(): DeliveryServiceMetadataApiMock {
    if (!this._instance) {
      this._instance = new DeliveryServiceMetadataApiMock();
    }

    return this._instance;
  }
  //endregion
}

//region [[ Mock config types ]]
interface DeliveryServiceMetadataApiMockConfig {
  sampleText: string;
}
//endregion
