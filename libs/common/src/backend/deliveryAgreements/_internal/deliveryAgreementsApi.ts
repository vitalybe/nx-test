import { loggerCreator } from "../../../utils/logger";
import { getOriginForApi } from "../../backendOrigin";
import { combineUrl } from "../../../utils/combineUrl";
import { UrlParams } from "../../_utils/urlParams";
import { Ajax, AjaxMetadata } from "../../../utils/ajax";
import { devToolsStore } from "../../../components/devTools/_stores/devToolsStore";
import { DeliveryAgreementsApiMock } from "../../deliveryAgreements";
import {
  DeliveryAgreementApiEntity,
  DeliveryAgreementUpdateApiEntity,
} from "../_types/deliveryAgreementsTypes";
import { MockWrapperProxy } from "../../_utils/mockWrapperProxy/mockWrapperProxy";
import { UrlStore } from "../../../stores/urlStore/urlStore";
import { CommonUrlParams } from "../../../urlParams/commonUrlParams";
import {
  DeliveryAgreementsObfuscation,
  validateDeliveryAgreements,
} from "../deliveryAgreementsUtils";

const moduleLogger = loggerCreator("__filename");
const BACKEND_URL = combineUrl(getOriginForApi("delivery-agreements"), "/api/1.0/delivery-agreements/");

export type ValidatedDeliveryAgreement = Required<
  Pick<DeliveryAgreementApiEntity, "contentPublisher" | "network" | "dsMetadata">
> &
  DeliveryAgreementApiEntity;

export class DeliveryAgreementsApi {
  protected constructor() {}

  async listValidated(metadata: AjaxMetadata): Promise<ValidatedDeliveryAgreement[]> {
    return await this.list(metadata).then(validateDeliveryAgreements);
  }

  async list(metadata: AjaxMetadata): Promise<DeliveryAgreementApiEntity[]> {
    const params = new UrlParams({ populateMode: "full" }).stringified;
    const path = combineUrl(BACKEND_URL, params);

    const data = (await Ajax.getJson(path, metadata)) as DeliveryAgreementApiEntity[];
    const isObfuscateEntities = UrlStore.getInstance().getParamExists(CommonUrlParams.obfuscate);

    if (isObfuscateEntities) {
      return DeliveryAgreementsObfuscation.obfuscateEntities(data);
    }
    return data;
  }

  async update(id: string, entity: DeliveryAgreementUpdateApiEntity) {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, id, params);

    await Ajax.putJson(path, entity);
  }

  async create(entity: DeliveryAgreementUpdateApiEntity) {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, params);

    await Ajax.postJson(path, entity);
  }

  async delete(id: string) {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, id, params);

    await Ajax.deleteJson(path);
  }

  //region [[ Singleton ]]
  protected static _instance: DeliveryAgreementsApi | undefined;
  static get instance(): DeliveryAgreementsApi {
    if (!this._instance) {
      const realApi = new DeliveryAgreementsApi();
      const mockApi = MockWrapperProxy.wrap(realApi, DeliveryAgreementsApiMock.instance);
      this._instance = !devToolsStore.isMockMode ? realApi : mockApi;
    }

    return this._instance;
  }
  //endregion
}
