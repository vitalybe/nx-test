import { loggerCreator } from "../utils/logger";
import { AjaxMetadata } from "../utils/ajax";
import { MediaSitePackAllSitesData, MediaSitePackSiteData } from "../backend/mediaSitePack/_types/mediaSitePackTypes";
import { MediaSitePackApi } from "../backend/mediaSitePack";

const moduleLogger = loggerCreator("__filename");

export enum ServiceTypesEnum {
  VOD = "VideoOnDemand",
  LIVE = "Live",
  MUSIC = "Music",
  DOWNLOAD = "SoftwareDownloads",
  IMAGE = "FileSharing",
  OTHER = "Other",
}

export class MediaSitePackProvider {
  private constructor() {}

  private _cache: MediaSitePackAllSitesData | undefined;

  provide = async (metadata: AjaxMetadata): Promise<MediaSitePackAllSitesData> => {
    if (!this._cache) {
      this._cache = await MediaSitePackApi.instance.getAllSitesData(metadata);
    }

    return this._cache;
  };

  provideSiteServiceType(site: MediaSitePackSiteData) {
    let serviceType = site.type;
    if (serviceType?.startsWith("k")) {
      serviceType = serviceType.slice(1);
    }
    return serviceType as ServiceTypesEnum;
  }

  //region [[ Singleton ]]
  private static _instance: MediaSitePackProvider | undefined;
  static get instance(): MediaSitePackProvider {
    if (!this._instance) {
      this._instance = new MediaSitePackProvider();
    }

    return this._instance;
  }
  //endregion
}
