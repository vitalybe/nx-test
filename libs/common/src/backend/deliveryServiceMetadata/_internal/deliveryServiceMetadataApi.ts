import { loggerCreator } from "../../../utils/logger";
import { getOriginForApi } from "../../backendOrigin";
import { combineUrl } from "../../../utils/combineUrl";
import { UrlParams } from "../../_utils/urlParams";
import { Ajax, AjaxMetadata } from "../../../utils/ajax";
import { devToolsStore } from "../../../components/devTools/_stores/devToolsStore";
import { MockWrapperProxy } from "../../_utils/mockWrapperProxy/mockWrapperProxy";
import {
  DeliveryServiceMetadataApiResult,
  DeliveryServiceMetadataCreateApiType,
  DeliveryServiceMetadataEditApiType,
  DeliveryServiceMetadataIconType,
} from "../../deliveryServices/_types/deliveryServiceMetadataTypes";
import { DeliveryServiceMetadataApiMock } from "./deliveryServiceMetadataApiMock";

const moduleLogger = loggerCreator("__filename");
const BACKEND_URL = combineUrl(getOriginForApi("delivery-services"), "/api/4.0/delivery-service-metadata/");
const ORG_ID_HEADER = "X-QC-OrgId";

export class DeliveryServiceMetadataApi {
  protected constructor() {}

  async getMetadata(id: string, metadata: AjaxMetadata): Promise<DeliveryServiceMetadataApiResult> {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, id, params);

    return (await Ajax.getJson(path, metadata)) as DeliveryServiceMetadataApiResult;
  }

  async list(metadata: AjaxMetadata): Promise<DeliveryServiceMetadataApiResult[]> {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, params);

    const data = await Ajax.getJson(path, metadata);
    return data as DeliveryServiceMetadataApiResult[];
  }

  async update(id: string, payload: DeliveryServiceMetadataEditApiType): Promise<DeliveryServiceMetadataApiResult> {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, id, params);

    return (await Ajax.putJson(path, payload)) as DeliveryServiceMetadataApiResult;
  }

  async create(entity: DeliveryServiceMetadataCreateApiType, orgId: string): Promise<DeliveryServiceMetadataApiResult> {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, params);

    return (await Ajax.postJson(path, entity, { [ORG_ID_HEADER]: orgId })) as DeliveryServiceMetadataApiResult;
  }

  async delete(id: string, orgId: string) {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, id, params);

    await Ajax.deleteJson(path, { [ORG_ID_HEADER]: orgId });
  }

  async updateIcon(id: string, entity: DeliveryServiceMetadataIconType) {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, id, "icon", params);

    await Ajax.putJson(path, entity);
  }

  async getIcon(id: string, metadata: AjaxMetadata): Promise<DeliveryServiceMetadataIconType> {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, id, "icon", params);

    const data = await Ajax.getJson(path, metadata);
    return data as DeliveryServiceMetadataIconType;
  }

  //region [[ Singleton ]]
  protected static _instance: DeliveryServiceMetadataApi | undefined;
  static get instance(): DeliveryServiceMetadataApi {
    if (!this._instance) {
      const realApi = new DeliveryServiceMetadataApi();
      const mockApi = MockWrapperProxy.wrap(realApi, DeliveryServiceMetadataApiMock.instance);
      this._instance = !devToolsStore.isMockMode ? realApi : mockApi;
    }

    return this._instance;
  }
  //endregion
}
