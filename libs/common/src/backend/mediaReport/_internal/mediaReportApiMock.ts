/* eslint-disable unused-imports/no-unused-vars,unused-imports/no-unused-vars */
import { AjaxMetadata } from "common/utils/ajax";
import { sleep } from "common/utils/sleep";
import { MediaReportApi } from "common/backend/mediaReport";
import {
  MediaReportDataApiType,
  MediaReportParams,
  MediaReportResponseType,
  MediaReportTypeEnum,
} from "common/backend/mediaReport/_types/mediaReportTypes";
import { loggerCreator } from "common/utils/logger";
import { mockNetworkSleep } from "common/utils/mockUtils";
import { TimeConfig } from "../../../utils/timeConfig";
import { HistogramSeries } from "common/utils/histograms/domain/histogramSeries";

// noinspection JSUnusedLocalSymbols
const moduleLogger = loggerCreator(__filename);

const DLTS = ["dlt1", "dlt2", "dlt3", "dlt4", "dlt5"];
const CODES = ["201", "203", "211", "312", "301", "401", "403", "404", "500", "503"];

export class MediaReportApiMock implements MediaReportApi {
  async getReport(
    reportType: MediaReportTypeEnum,
    timeConfig: TimeConfig,
    additionalParams?: MediaReportParams,
    metadata: AjaxMetadata = new AjaxMetadata()
  ): Promise<MediaReportResponseType[]> {
    await sleep(mockNetworkSleep);
    let result: MediaReportResponseType[];

    if (reportType !== MediaReportTypeEnum.TPS) {
      result = DLTS.map(
        (dlt) =>
          ({
            groupByValue: dlt,
            data: [this.getMediaReportDataApiType("QWILT"), this.getMediaReportDataApiType("ORIGIN")],
          } as MediaReportResponseType)
      );
    } else {
      result = DLTS.map((dlt) => {
        const qwiltData: MediaReportDataApiType[] = [];
        const originData: MediaReportDataApiType[] = [];

        for (const code of CODES) {
          const originHistogram = HistogramSeries.createMock();
          const totalHistogram = HistogramSeries.fromMultipleSeriesSum([originHistogram, HistogramSeries.createMock()]);
          qwiltData.push(this.getMediaReportDataApiType("QWILT", totalHistogram, code) as MediaReportDataApiType);
          originData.push(this.getMediaReportDataApiType("ORIGIN", originHistogram, code) as MediaReportDataApiType);
        }

        return {
          groupByValue: dlt,
          data: [...qwiltData, ...originData],
        };
      });
    }

    return result;
  }

  getMediaReportDataApiType(deliveredBy: "QWILT" | "ORIGIN", histogram = HistogramSeries.createMock(), code?: string) {
    return {
      dimensions: {
        deliveredBy,
        code,
      },
      histogram: histogram.points.map((point) => ({
        value: point.y ?? 0,
        timestamp: point.x / 1000,
      })),
      stats: {
        max: {
          timestamp: histogram.peakPoint.x / 1000,
          value: histogram.peakPoint.y,
        },
        min: {
          timestamp: histogram.minPoint.x / 1000,
          value: histogram.minPoint.y,
        },
      },
    };
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
