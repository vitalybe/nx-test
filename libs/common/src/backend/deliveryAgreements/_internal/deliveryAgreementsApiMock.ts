/* eslint-disable unused-imports/no-unused-vars */
import { AjaxMetadata } from "../../../utils/ajax";
import { mockNetworkSleep } from "../../../utils/mockUtils";
import { sleep } from "../../../utils/sleep";
import { DeliveryAgreementsApi, ValidatedDeliveryAgreement } from "../../deliveryAgreements";
import {
  DeliveryAgreementApiEntity,
  DeliveryAgreementUpdateApiEntity,
} from "../_types/deliveryAgreementsTypes";
import { loggerCreator } from "../../../utils/logger";
import { UrlStore } from "../../../stores/urlStore/urlStore";
import { CommonUrlParams } from "../../../urlParams/commonUrlParams";
import {
  DeliveryAgreementsObfuscation,
  validateDeliveryAgreements,
} from "../deliveryAgreementsUtils";

// noinspection JSUnusedLocalSymbols
const moduleLogger = loggerCreator("__filename");

const mock = require("../_mocks/daMock.json");

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
