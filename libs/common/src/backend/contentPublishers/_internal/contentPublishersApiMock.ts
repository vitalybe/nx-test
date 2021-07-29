/* eslint-disable unused-imports/no-unused-vars */
import { AjaxMetadata } from "../../../utils/ajax";
import { sleep } from "../../../utils/sleep";
import { ContentPublishersApi } from "../../contentPublishers";
import {
  ContentPublisherApiType,
  ContentPublisherUpdateApiType,
} from "../_types/contentPublishersTypes";
import mockData from "../../_utils/mockData";

import { loggerCreator } from "../../../utils/logger";
import { mockNetworkSleep } from "../../../utils/mockUtils";

const moduleLogger = loggerCreator("__filename");

export class ContentPublishersApiMock extends ContentPublishersApi {
  async contentPublishersList(metadata: AjaxMetadata): Promise<ContentPublisherApiType[]> {
    await sleep(mockNetworkSleep);

    return [
      {
        id: "valveId",
        name: "Valve",
        sites: [
          { uiName: "Steam", topperName: mockData.sites[0] },
          { uiName: "HL3", topperName: mockData.sites[1] },
        ],
        networks: [
          {
            id: 0,
            country: "SomeCountry",
            uiName: "FastNET",
            uniqueName: mockData.networks[0],
          },
        ],
      },
      {
        id: "microsoftId",
        name: "Microsoft",
        sites: [{ uiName: "VB.NET", topperName: mockData.sites[2] }],
        networks: [
          {
            id: 1,
            country: "SomeCountry",
            uiName: "SomeNET",
            uniqueName: mockData.networks[1],
          },
        ],
      },
    ];
  }

  async contentPublishersUpdate(id: string, entity: ContentPublisherUpdateApiType) {
    await sleep(mockNetworkSleep);
    moduleLogger.debug("Mock update, id: " + id);
    moduleLogger.debug(JSON.stringify(entity));
  }

  async contentPublishersCreate(entity: ContentPublisherUpdateApiType) {
    await sleep(mockNetworkSleep);
    moduleLogger.debug("Mock create: ");
    moduleLogger.debug(JSON.stringify(entity));
  }

  async contentPublishersDelete(id: string) {
    await sleep(mockNetworkSleep);
    moduleLogger.debug("Mock delete: " + id);
  }

  //region [[ Singleton ]]
  protected static _instance: ContentPublishersApiMock | undefined;
  static get instance(): ContentPublishersApiMock {
    if (!this._instance) {
      this._instance = new ContentPublishersApiMock();
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
  mockConfig: ContentPublishersApiMockConfig = this.getDefaultMockConfig();
  //endregion
}

//region [[ Mock config types ]]
interface ContentPublishersApiMockConfig {
  sampleText: string;
}
//endregion
