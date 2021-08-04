import { loggerCreator } from "common/utils/logger";
import { getOriginForApi } from "common/backend/backendOrigin";
import { combineUrl } from "common/utils/combineUrl";
import { UrlParams } from "common/backend/_utils/urlParams";
import { Ajax, AjaxMetadata } from "common/utils/ajax";
import { devToolsStore } from "common/components/devTools/_stores/devToolsStore";
import { MediaReportApiMock } from "common/backend/mediaReport";
import {
  MediaReportApiResult,
  MediaReportParams,
  MediaReportResponseType,
  MediaReportTypeEnum,
} from "common/backend/mediaReport/_types/mediaReportTypes";
import { MockWrapperProxy } from "common/backend/_utils/mockWrapperProxy/mockWrapperProxy";
import { TimeConfig } from "../../../utils/timeConfig";

const moduleLogger = loggerCreator(__filename);
const BACKEND_URL = combineUrl(getOriginForApi("media-reports"), "/api/1/reports/cp/delegationTarget");

export class MediaReportApi {
  protected constructor() {}

  async getReport(
    reportType: MediaReportTypeEnum,
    timeConfig: TimeConfig,
    additionalParams?: MediaReportParams,
    metadata: AjaxMetadata = new AjaxMetadata()
  ): Promise<MediaReportResponseType[]> {
    const params = new UrlParams({
      from: Math.floor(timeConfig.fromDate.toSeconds()),
      to: Math.floor(timeConfig.toDate.toSeconds()),
      interval: timeConfig.binInterval.as("seconds"),
      ...additionalParams,
    }).stringified;

    const path = combineUrl(BACKEND_URL, reportType, params);
    const data = (await Ajax.getJson(path, metadata)) as MediaReportApiResult;
    return data.response as MediaReportResponseType[];
  }

  //region [[ Singleton ]]
  protected static _instance: MediaReportApi | undefined;
  static get instance(): MediaReportApi {
    if (!this._instance) {
      const realApi = new MediaReportApi();
      const mockApi = MockWrapperProxy.wrap(realApi, MediaReportApiMock.instance);
      this._instance = !devToolsStore.isMockMode ? realApi : mockApi;
    }

    return this._instance;
  }
  //endregion
}
