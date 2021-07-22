/* eslint-disable unused-imports/no-unused-vars */
import { AjaxMetadata } from "common/utils/ajax";
import { mockNetworkSleep } from "common/utils/mockUtils";
import { sleep } from "common/utils/sleep";
import { DeliveryAgreementsApi, ValidatedDeliveryAgreement } from "common/backend/deliveryAgreements";
import {
  DeliveryAgreementApiEntity,
  DeliveryAgreementUpdateApiEntity,
} from "common/backend/deliveryAgreements/_types/deliveryAgreementsTypes";
import { loggerCreator } from "common/utils/logger";
import { UrlStore } from "common/stores/urlStore/urlStore";
import { CommonUrlParams } from "common/urlParams/commonUrlParams";
import {
  DeliveryAgreementsObfuscation,
  validateDeliveryAgreements,
} from "common/backend/deliveryAgreements/deliveryAgreementsUtils";

// noinspection JSUnusedLocalSymbols
const moduleLogger = loggerCreator(__filename);

const mock = require("common/backend/deliveryAgreements/_mocks/daMock.json");

export class DeliveryAgreementsApiMock implements DeliveryAgreementsApi {
  async listValidated(): Promise<ValidatedDeliveryAgreement[]> {
    return await this.list(new AjaxMetadata()).then(validateDeliveryAgreements);
  }
  async list(metadata: AjaxMetadata): Promise<DeliveryAgreementApiEntity[]> {
    await sleep(mockNetworkSleep);

    const isObfuscateEntities = UrlStore.getInstance().getParamExists(CommonUrlParams.obfuscate);

    if (isObfuscateEntities) {
      return DeliveryAgreementsObfuscation.obfuscateEntities(mock);
    }

    return mock;
  }

  async update(id: string, entity: DeliveryAgreementUpdateApiEntity) {
    await sleep(mockNetworkSleep);
  }

  async create(entity: DeliveryAgreementUpdateApiEntity) {
    await sleep(mockNetworkSleep);
  }

  async delete(id: string) {
    await sleep(mockNetworkSleep);
  }

  //region [[ Singleton ]]
  protected static _instance: DeliveryAgreementsApiMock | undefined;
  static get instance(): DeliveryAgreementsApiMock {
    if (!this._instance) {
      this._instance = new DeliveryAgreementsApiMock();
    }

    return this._instance;
  }
  //endregion
}

//region [[ Mock config types ]]
interface DeliveryAgreementsApiMockConfig {
  sampleText: string;
}
//endregion
