/* eslint-disable unused-imports/no-unused-vars,unused-imports/no-unused-vars */
import { AjaxMetadata } from "../../../utils/ajax";
import { sleep } from "../../../utils/sleep";
import { MediaReportApi } from "../../mediaReport";
import {
  MediaReportParams,
  MediaReportResponseType,
  MediaReportTypeEnum,
} from "../_types/mediaReportTypes";
import { loggerCreator } from "../../../utils/logger";
import { mockNetworkSleep } from "../../../utils/mockUtils";
import { TimeConfig } from "../../../utils/timeConfig";

// noinspection JSUnusedLocalSymbols
const moduleLogger = loggerCreator("__filename");

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
