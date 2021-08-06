import { loggerCreator } from "../../../utils/logger";
import { combineUrl } from "../../../utils/combineUrl";
import { UrlParams } from "../../_utils/urlParams";
import { Ajax, AjaxMetadata } from "../../../utils/ajax";
import { devToolsStore } from "../../../components/devTools/_stores/devToolsStore";
import { CsmStateApiMock } from "../../csmState";
import { MockWrapperProxy } from "../../_utils/mockWrapperProxy/mockWrapperProxy";
import {
  CsmStateDevicesStatusApiType,
  CsmStateParcelApiType,
  DependencyVerticalsApiResult,
  ParcelStoreData,
} from "../_types/csmStateTypes";
import { ConfigurationCdnEndpoint, CsmStateUtils } from "../_utils/utils";
import { getOriginForApi } from "../../backendOrigin";

const moduleLogger = loggerCreator("__filename");
const BACKEND_ENDPOINT = "debug/dashboard/";

export class CsmStateApi {
  protected constructor() {}

  async listParcels(
    cdnEndpoint: ConfigurationCdnEndpoint | undefined,
    metadata: AjaxMetadata
  ): Promise<CsmStateParcelApiType[]> {
    const BACKEND_URL = combineUrl(CsmStateUtils.getApiEndpoint(cdnEndpoint), BACKEND_ENDPOINT);
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, "parcels", params);

    const data = await Ajax.getJson(path, metadata);
    return data as CsmStateParcelApiType[];
  }

  async listDevicesStatus(
    cdnEndpoint: ConfigurationCdnEndpoint | undefined,
    metadata: AjaxMetadata
  ): Promise<CsmStateDevicesStatusApiType[]> {
    let prefixOverride;
    if (
      [ConfigurationCdnEndpoint.QWILTED_CDS.toString(), ConfigurationCdnEndpoint.QWILTED_PROD.toString()].includes(
        cdnEndpoint ?? ""
      )
    ) {
      prefixOverride = `${cdnEndpoint}-`;
    }

    const BACKEND_URL = combineUrl(
      CsmStateUtils.getApiEndpoint(cdnEndpoint, "transport-internal", prefixOverride),
      BACKEND_ENDPOINT
    );
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, "devices-status", params);

    const data = await Ajax.getJson(path, metadata);
    return data as CsmStateDevicesStatusApiType[];
  }

  async getDependencyVerticals(
    cdnEndpoint: ConfigurationCdnEndpoint | undefined,
    metadata: AjaxMetadata
  ): Promise<DependencyVerticalsApiResult> {
    const BACKEND_URL = combineUrl(CsmStateUtils.getApiEndpoint(cdnEndpoint), BACKEND_ENDPOINT);
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, "plane-verticals", params);

    const data = await Ajax.getJson(path, metadata);
    return data as DependencyVerticalsApiResult;
  }

  async getParcelStoreData(parcelId: string, metadata: AjaxMetadata): Promise<ParcelStoreData> {
    const BACKEND_URL = combineUrl(getOriginForApi("parcel-store-internal"), "api/1.0.0", "parcels", parcelId);
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, params);

    const data = await Ajax.getJson(path, metadata);
    return data as ParcelStoreData;
  }

  //region [[ Singleton ]]
  protected static _instance: CsmStateApi | undefined;
  static get instance(): CsmStateApi {
    if (!this._instance) {
      const realApi = new CsmStateApi();
      const mockApi = MockWrapperProxy.wrap(realApi, CsmStateApiMock.instance);
      this._instance = !devToolsStore.isMockMode ? realApi : mockApi;
    }

    return this._instance;
  }
  //endregion
}
