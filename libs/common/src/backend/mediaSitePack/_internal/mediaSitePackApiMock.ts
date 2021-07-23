/* eslint-disable unused-imports/no-unused-vars */
import { AjaxMetadata } from "common/utils/ajax";
import { sleep } from "common/utils/sleep";
import { MediaSitePackApi } from "common/backend/mediaSitePack";
import { MediaSitePackAllSitesData } from "common/backend/mediaSitePack/_types/mediaSitePackTypes";
import mockData from "common/backend/_utils/mockData";
import { mockNetworkSleep } from "common/utils/mockUtils";

export class MediaSitePackApiMock extends MediaSitePackApi {
  async getAllSitesData(metadata: AjaxMetadata): Promise<MediaSitePackAllSitesData> {
    await sleep(mockNetworkSleep);

    return {
      sites: [
        {
          id: mockData.sites[0],
          name: "Instanbul.net",
          type: "kVideoOnDemand",
          iconUrl: "/icons/akamai.png",
          reportBitrate: false,
        },
        {
          id: mockData.sites[1],
          name: "BBC America",
          type: "kVideoOnDemand",
          iconUrl: "/icons/bbcamerica.com.png",
          reportBitrate: false,
        },
        {
          id: mockData.sites[2],
          name: "Fox",
          type: "kVideoOnDemand",
          iconUrl: "/icons/fox.png",
          reportBitrate: false,
        },
      ],
    };
  }

  //region [[ Singleton ]]
  protected static _instance: MediaSitePackApiMock | undefined;
  static get instance(): MediaSitePackApiMock {
    if (!this._instance) {
      this._instance = new MediaSitePackApiMock();
    }

    return this._instance;
  }
  //endregion

  //region [[ Mock config ]]
  private getDefaultMockConfig() {
    return {
      sampleText: "very mock",
    };
  }
  mockConfig: MediaSitePackApiMockConfig = this.getDefaultMockConfig();
  //endregion
}

//region [[ Mock config types ]]
interface MediaSitePackApiMockConfig {
  sampleText: string;
}
//endregion
