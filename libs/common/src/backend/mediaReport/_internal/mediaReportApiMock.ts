/* eslint-disable unused-imports/no-unused-vars,unused-imports/no-unused-vars */
import { AjaxMetadata } from "common/utils/ajax";
import { sleep } from "common/utils/sleep";
import { MediaReportApi } from "common/backend/mediaReport";
import {
  MediaReportParams,
  MediaReportResponseType,
  MediaReportTypeEnum,
} from "common/backend/mediaReport/_types/mediaReportTypes";
import { loggerCreator } from "common/utils/logger";
import { mockNetworkSleep } from "common/utils/mockUtils";
import { TimeConfig } from "../../../utils/timeConfig";

// noinspection JSUnusedLocalSymbols
const moduleLogger = loggerCreator(__filename);

export class MediaReportApiMock implements MediaReportApi {
  async getReport(
    reportType: MediaReportTypeEnum,
    timeConfig: TimeConfig,
    additionalParams?: MediaReportParams,
    metadata: AjaxMetadata = new AjaxMetadata()
  ): Promise<MediaReportResponseType[]> {
    await sleep(mockNetworkSleep);
    return [];
  }

  //region [[ Singleton ]]
  protected static _instance: MediaReportApiMock | undefined;
  static get instance(): MediaReportApiMock {
    if (!this._instance) {
      this._instance = new MediaReportApiMock();
    }

    return this._instance;
  }
  //endregion
}

//region [[ Mock config types ]]
interface MediaReportApiMockConfig {
  sampleText: string;
}
//endregion
