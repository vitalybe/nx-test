import { UrlStore } from "common/stores/urlStore/urlStore";
import { getOriginForApi } from "../../backendOrigin";
import { Params } from "common/urlParams/cfgDashboardUrlParams";

const API_NAME = "csm";

export enum ConfigurationCdnEndpoint {
  QWILTED_TEST = "qwtest",
  QWILTED_CDS = "cds",
  QWILTED_PROD = "qwprod",
}

export class CsmStateUtils {
  private static originUrl(apiName: string) {
    const prefixParam = UrlStore.getInstance().getParam(Params.csmHostnamePrefix);
    const prefix = prefixParam ? prefixParam + "-" : "";

    return getOriginForApi(apiName, undefined, prefix);
  }

  private static getCsmEndpoint(cdnEndpoint: ConfigurationCdnEndpoint, apiName: string, prefixOverride?: string) {
    const hostnamePrefix = UrlStore.getInstance().getParam(Params.csmHostnamePrefix) ?? "red";
    const prefix = prefixOverride ?? `${hostnamePrefix}-${cdnEndpoint}-`;
    return getOriginForApi(apiName, undefined, prefix);
  }

  static getApiEndpoint(cdnEndpoint?: ConfigurationCdnEndpoint, apiName = API_NAME, prefixOverride?: string) {
    return cdnEndpoint
      ? CsmStateUtils.getCsmEndpoint(cdnEndpoint, apiName, prefixOverride)
      : CsmStateUtils.originUrl(apiName);
  }
}
