import {
  ApiCoverageAggregation,
  ApiGeoEntities,
  ApiIspEntities,
  GeoEntitiesParams,
} from "./geoDeploymentTypes";
import { UrlParams } from "../_utils/urlParams";
import { getOriginForApi } from "../backendOrigin";
import { Ajax, AjaxMetadata } from "../../utils/ajax";
import { UrlStore } from "../../stores/urlStore/urlStore";
import { CommonUrlParams } from "../../urlParams/commonUrlParams";
import { GeoDeploymentUtils } from "./_utils/utils";

// Source - https://docs.google.com/document/u/1/d/1iwGKaq9azbMy6xRU1s7GpKPxvGhstIOKL9q-qipm1UM/edit?usp=sharing_eil&ts=5b7e8b87
class GeoDeploymentApi {
  private readonly originUrl = getOriginForApi("geo-deployment");

  getEntities = async (metadata?: AjaxMetadata, options?: Partial<GeoEntitiesParams>): Promise<ApiGeoEntities> => {
    const params = new UrlParams<GeoEntitiesParams>({
      entitiesListFormat: "detailsAndCoverage",
      containsListFormat: "detailsAndCoverage",
      containsListRecursive: true,
      ...options,
    });
    const url = new URL(`${this.originUrl}/api/1.0/entities/${params.stringified}`);
    return (await Ajax.getJson(url.href, metadata)) as ApiGeoEntities;
  };

  getIsps = async (): Promise<ApiIspEntities> => {
    const params = new UrlParams({
      autonomousSystemsListFormat: "details",
    });
    const url = new URL(`${this.originUrl}/api/1.0/isps/${params.stringified}`);
    const data = (await Ajax.getJson(url.href)) as ApiIspEntities;

    const obfuscate = UrlStore.getInstance().getParamExists(CommonUrlParams.obfuscate);

    if (obfuscate) {
      return GeoDeploymentUtils.obfuscateIspsDisplayName(data);
    } else {
      return data;
    }
  };

  getCoverage = async (ids: string[], metadata?: AjaxMetadata): Promise<ApiCoverageAggregation> => {
    const params = new UrlParams({ ids });
    const url = new URL(`${this.originUrl}/api/1.0/coverage/${params.stringified}`);
    return (await Ajax.getJson(url.href, metadata)) as ApiCoverageAggregation;
  };
}

export interface GeoDeploymentApiInterface extends GeoDeploymentApi {}

export const geoDeploymentApi = new GeoDeploymentApi();
