import { loggerCreator } from "../../../utils/logger";
import { getOriginForApi } from "../../backendOrigin";
import { combineUrl } from "../../../utils/combineUrl";
import { UrlParams } from "../../_utils/urlParams";
import { Ajax, AjaxMetadata } from "../../../utils/ajax";
import { devToolsStore } from "../../../components/devTools/_stores/devToolsStore";
import { MediaSitePackApiMock } from "../../mediaSitePack";
import { MediaSitePackAllSitesData } from "../_types/mediaSitePackTypes";

const moduleLogger = loggerCreator("__filename");

export class MediaSitePackApi {
  protected constructor() {}
  static readonly BACKEND_URL = combineUrl(getOriginForApi("media-site-pack"));

  async getAllSitesData(metadata: AjaxMetadata): Promise<MediaSitePackAllSitesData> {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(MediaSitePackApi.BACKEND_URL, "siteList/", params);

    const data = await Ajax.getJson(path, metadata);
    return data as MediaSitePackAllSitesData;
  }

  //region [[ Singleton ]]
  protected static _instance: MediaSitePackApi | undefined;
  static get instance(): MediaSitePackApi {
    if (!this._instance) {
      this._instance = !devToolsStore.isMockMode ? new MediaSitePackApi() : MediaSitePackApiMock.instance;
    }

    return this._instance;
  }
  //endregion
}
