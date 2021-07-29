import { loggerCreator } from "common/utils/logger";
import { getOriginForApi } from "common/backend/backendOrigin";
import { combineUrl } from "common/utils/combineUrl";
import { UrlParams } from "common/backend/_utils/urlParams";
import { Ajax, AjaxMetadata } from "common/utils/ajax";
import { devToolsStore } from "common/components/devTools/_stores/devToolsStore";
import { SubscriptionsApiMock } from "common/backend/subscriptions";
import {
  DestinationApiType,
  DestinationApiTypePayload,
  SubscriptionsApiResult,
  SubscriptionsApiTypePayload,
} from "common/backend/subscriptions/_types/subscriptionsTypes";
import { MockWrapperProxy } from "common/backend/_utils/mockWrapperProxy/mockWrapperProxy";
import { QcApiTypeEnum } from "common/backend/subscriptions/_types/subscriptionsTypes";

const moduleLogger = loggerCreator(__filename);
const BACKEND_URL = combineUrl(getOriginForApi("subscriptions-manager"), "/api/1/subscriptions");
const QC_ORG_ID_HEADER = "x-qc-orgid";

export class SubscriptionsApi {
  protected constructor() {}

  async list(metadata: AjaxMetadata, qcApi: QcApiTypeEnum): Promise<SubscriptionsApiResult> {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, qcApi, params);

    const data = await Ajax.getJson(path, metadata);
    return data as SubscriptionsApiResult;
  }

  async destinationsList(metadata: AjaxMetadata, qcApi: QcApiTypeEnum) {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, qcApi, "destinations", params);

    const data = await Ajax.getJson(path, metadata);
    return data as DestinationApiType[];
  }

  async updateSubscription(id: string, orgId: string, qcApi: QcApiTypeEnum, payload: SubscriptionsApiTypePayload) {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, qcApi, id, params);

    await Ajax.putJson(path, payload, { [QC_ORG_ID_HEADER]: orgId });
  }

  async createSubscription(orgId: string, qcApi: QcApiTypeEnum, payload: SubscriptionsApiTypePayload) {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, qcApi, params);

    await Ajax.postJson(path, payload, { [QC_ORG_ID_HEADER]: orgId });
  }

  async deleteSubscription(id: string, qcApi: QcApiTypeEnum) {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, qcApi, id, params);

    await Ajax.deleteJson(path);
  }
  async updateDestination(id: string, orgId: string, qcApi: QcApiTypeEnum, payload: DestinationApiTypePayload) {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, qcApi, "destinations", id, params);

    await Ajax.putJson(path, payload, { [QC_ORG_ID_HEADER]: orgId });
  }

  async createDestination(orgId: string, qcApi: QcApiTypeEnum, payload: DestinationApiTypePayload) {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, qcApi, "destinations", params);

    await Ajax.postJson(path, payload, { [QC_ORG_ID_HEADER]: orgId });
  }

  async deleteDestination(id: string, qcApi: QcApiTypeEnum) {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, qcApi, "destinations", id, params);

    await Ajax.deleteJson(path);
  }

  //region [[ Singleton ]]
  protected static _instance: SubscriptionsApi | undefined;
  static get instance(): SubscriptionsApi {
    if (!this._instance) {
      const realApi = new SubscriptionsApi();
      const mockApi = MockWrapperProxy.wrap(realApi, SubscriptionsApiMock.instance);
      this._instance = !devToolsStore.isMockMode ? realApi : mockApi;
    }

    return this._instance;
  }
  //endregion
}
