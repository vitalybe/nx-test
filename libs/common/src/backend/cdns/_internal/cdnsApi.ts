import { Ajax, AjaxMetadata } from "common/utils/ajax";
import { combineUrl } from "common/utils/combineUrl";
import { UrlParams } from "common/backend/_utils/urlParams";
import { CdnApiResult, CdnEditApiType } from "common/backend/cdns/_types/cdnApiType";
import { getOriginForApi } from "common/backend/backendOrigin";
import { DeliveryUnitApiResult, DeliveryUnitEditApiType } from "common/backend/cdns/_types/deliveryUnitApiType";
import {
  DeliveryUnitGroupApiResult,
  DeliveryUnitGroupEditApiType,
} from "common/backend/cdns/_types/deliveryUnitGroupApiType";
import { devToolsStore } from "common/components/devTools/_stores/devToolsStore";
import { CdnLocationApiResult, CdnLocationEditApiType } from "common/backend/cdns/_types/cdnLocationApiType";
import { HttpRouterGroupsApiResult, HttpRouterGroupType } from "common/backend/cdns/_types/httpRouterGroupType";
import { CdnsApiMock } from "common/backend/cdns/_internal/cdnsApiMock";
import { MockWrapperProxy } from "common/backend/_utils/mockWrapperProxy/mockWrapperProxy";

const BACKEND_URL = combineUrl(getOriginForApi("cdns"), "/api/1.0/");

export class CdnsApi {
  // CDNS
  ////////

  async cdnList(metadata: AjaxMetadata): Promise<CdnApiResult> {
    const path = "cdns";
    const params = new UrlParams({}).stringified;

    const data = await Ajax.getJson(combineUrl(BACKEND_URL, path, params), metadata);
    return data as CdnApiResult;
  }

  async cdnCreate(values: CdnEditApiType): Promise<void> {
    const path = "cdns";
    const params = new UrlParams({}).stringified;

    await Ajax.postJson(combineUrl(BACKEND_URL, path, params), values);
  }

  async cdnUpdate(id: string, values: CdnEditApiType): Promise<void> {
    const path = combineUrl("cdns", id.toString());
    const params = new UrlParams({}).stringified;

    await Ajax.putJson(combineUrl(BACKEND_URL, path, params), values);
  }

  async cdnDelete(id: string): Promise<void> {
    const path = combineUrl("cdns", id.toString());
    const params = new UrlParams({}).stringified;

    await Ajax.deleteJson(combineUrl(BACKEND_URL, path, params));
  }

  // Delivery unit groups
  /////////////////////////

  async deliveryUnitGroupsList(cdnId: string, metadata?: AjaxMetadata): Promise<DeliveryUnitGroupApiResult> {
    const path = combineUrl("cdns", cdnId.toString(), "delivery-unit-groups");
    const params = new UrlParams({}).stringified;

    const data = await Ajax.getJson(combineUrl(BACKEND_URL, path, params), metadata);
    return data as DeliveryUnitGroupApiResult;
  }

  async deliveryUnitGroupsCreate(cdnId: string, values: DeliveryUnitGroupEditApiType): Promise<void> {
    const path = combineUrl("cdns", cdnId.toString(), "delivery-unit-groups");
    const params = new UrlParams({}).stringified;

    await Ajax.postJson(combineUrl(BACKEND_URL, path, params), values);
  }

  async deliveryUnitGroupsUpdate(cdnId: string, id: string, values: DeliveryUnitGroupEditApiType): Promise<void> {
    const path = combineUrl("cdns", cdnId.toString(), "delivery-unit-groups", id.toString());
    const params = new UrlParams({}).stringified;

    await Ajax.putJson(combineUrl(BACKEND_URL, path, params), values);
  }

  async deliveryUnitGroupsDelete(cdnId: string, id: string): Promise<void> {
    const path = combineUrl("cdns", cdnId.toString(), "delivery-unit-groups", id.toString());
    const params = new UrlParams({}).stringified;

    await Ajax.deleteJson(combineUrl(BACKEND_URL, path, params));
  }

  // Delivery units
  /////////////////

  async deliveryUnitsList(cdnId: string): Promise<DeliveryUnitApiResult> {
    const path = combineUrl("cdns", cdnId.toString(), "delivery-units");
    const params = new UrlParams({}).stringified;

    const data = await Ajax.getJson(combineUrl(BACKEND_URL, path, params));
    return data as DeliveryUnitApiResult;
  }

  async deliveryUnitsCreate(cdnId: string, values: DeliveryUnitEditApiType): Promise<void> {
    const path = combineUrl("cdns", cdnId.toString(), "delivery-units");
    const params = new UrlParams({}).stringified;

    await Ajax.postJson(combineUrl(BACKEND_URL, path, params), values);
  }

  async deliveryUnitsUpdate(cdnId: string, id: string, values: DeliveryUnitEditApiType): Promise<void> {
    const path = combineUrl("cdns", cdnId.toString(), "delivery-units", id.toString());
    const params = new UrlParams({}).stringified;

    await Ajax.putJson(combineUrl(BACKEND_URL, path, params), values);
  }

  async deliveryUnitsDelete(cdnId: string, id: string): Promise<void> {
    const path = combineUrl("cdns", cdnId.toString(), "delivery-units", id.toString());
    const params = new UrlParams({}).stringified;

    await Ajax.deleteJson(combineUrl(BACKEND_URL, path, params));
  }

  // Locations

  async locationList(cdnId: string): Promise<CdnLocationApiResult> {
    const path = combineUrl("cdns", cdnId.toString(), "locations");
    const params = new UrlParams({}).stringified;

    const data = await Ajax.getJson(combineUrl(BACKEND_URL, path, params));
    return data as CdnLocationApiResult;
  }

  async locationUpdate(cdnId: string, id: string, values: CdnLocationEditApiType): Promise<void> {
    const path = combineUrl("cdns", cdnId.toString(), "locations", id);
    const params = new UrlParams({}).stringified;

    await Ajax.putJson(combineUrl(BACKEND_URL, path, params), values);
  }

  async locationCreate(cdnId: string, values: { name: string }): Promise<void> {
    const path = combineUrl("cdns", cdnId.toString(), "locations");
    const params = new UrlParams({}).stringified;

    await Ajax.postJson(combineUrl(BACKEND_URL, path, params), values);
  }

  async locationDelete(cdnId: string, id: string): Promise<void> {
    const path = combineUrl("cdns", cdnId.toString(), "locations", id.toString());
    const params = new UrlParams({}).stringified;

    await Ajax.deleteJson(combineUrl(BACKEND_URL, path, params));
  }

  // HTTP Router groups
  /////////////////////////

  async httpRouterGroupsList(cdnId: string, metadata?: AjaxMetadata): Promise<HttpRouterGroupsApiResult> {
    const path = combineUrl("cdns", cdnId.toString(), "http-router-groups");
    const params = new UrlParams({}).stringified;

    const data = await Ajax.getJson(combineUrl(BACKEND_URL, path, params), metadata);
    return data as HttpRouterGroupsApiResult;
  }

  async httpRouterGroupsCreate(cdnId: string, values: HttpRouterGroupType) {
    const path = combineUrl("cdns", cdnId.toString(), "http-router-groups");
    const params = new UrlParams({}).stringified;

    await Ajax.postJson(combineUrl(BACKEND_URL, path, params), values);
  }

  async httpRouterGroupsUpdate(cdnId: string, id: string, values: HttpRouterGroupType) {
    const path = combineUrl("cdns", cdnId.toString(), "http-router-groups", id.toString());
    const params = new UrlParams({}).stringified;

    await Ajax.putJson(combineUrl(BACKEND_URL, path, params), values);
  }

  async httpRouterGroupsDelete(cdnId: string, id: string) {
    const path = combineUrl("cdns", cdnId.toString(), "http-router-groups", id.toString());
    const params = new UrlParams({}).stringified;

    await Ajax.deleteJson(combineUrl(BACKEND_URL, path, params));
  }

  //region [[ Singleton ]]
  protected static _instance: CdnsApi | undefined;
  static get instance(): CdnsApi {
    if (!this._instance) {
      const realApi = new CdnsApi();
      const mockApi = MockWrapperProxy.wrap(realApi, CdnsApiMock.instance);
      this._instance = !devToolsStore.isMockMode ? realApi : mockApi;
    }

    return this._instance;
  }
  //endregion
}
