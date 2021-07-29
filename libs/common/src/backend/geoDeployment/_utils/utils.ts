import { ApiIspEntities } from "common/backend/geoDeployment/geoDeploymentTypes";

export class GeoDeploymentUtils {
  static lastId = 0;

  static obfuscateIspsDisplayName(isps: ApiIspEntities): ApiIspEntities {
    return {
      ...isps,
      isps: isps.isps.map(isp => ({
        ...isp,
        displayName: "network" + this.lastId++,
      })),
    };
  }
}
