import { TimeConfig } from "common/utils/timeConfig";
import { AnalyticsParams, ApiHistogramType } from "common/backend/mediaAnalytics/mediaAnalyticsTypes";
import { AjaxMetadata } from "common/utils/ajax";
import { MediaAnalyticsSeries } from "common/backend/mediaAnalytics/mediaAnalyticsSeries";
import { HistogramSeries } from "common/utils/histograms/domain/histogramSeries";
import { HistogramPoint } from "common/utils/histograms/domain/histogramPoint";
import { MediaAnalyticsApi } from "common/backend/mediaAnalytics";

type MediaAnalyticsSeriesByKey = { [key: string]: MediaAnalyticsSeries };
type HistogramSeriesByKey<T> = { [key in keyof T]: HistogramSeries };

export interface HistogramProviderResult<T> {
  adjustedTimeConfig: TimeConfig;
  histogramBySeriesId: HistogramSeriesByKey<T>;
}

export class HistogramProviderError<T extends MediaAnalyticsSeriesByKey> extends Error {
  constructor(public originalError: Error, public blankResult: HistogramProviderResult<T>) {
    super();
  }
}

export class HistogramProvider {
  async provide<T extends MediaAnalyticsSeriesByKey>(
    timeConfig: TimeConfig,
    analyticsSeries: T,
    additionalParams: AnalyticsParams = {},
    metadata?: AjaxMetadata
  ): Promise<HistogramProviderResult<T>> {
    try {
      if (additionalParams.group_by !== undefined) {
        throw new Error("Use histogramGroupProvider for grouped calls");
      }

      const histogramResult = await MediaAnalyticsApi.instance.getHistogram(
        timeConfig,
        Object.values(analyticsSeries),
        additionalParams,
        metadata
      );
      const histogram = histogramResult.report as ApiHistogramType;
      const bins = histogram.reports.overtime.histogram.bins;

      const seriesByKey: Partial<{ [key: string]: HistogramSeries }> = {};
      for (const [seriesKey, series] of Object.entries(analyticsSeries)) {
        const points: HistogramPoint[] = [];
        for (const bin of bins) {
          const timestampMilliseconds = bin.timestamp * 1000;
          const value: number = bin.series[series.name];

          points.push(new HistogramPoint(points.length, timestampMilliseconds, value));
        }
        seriesByKey[seriesKey] = new HistogramSeries(series.name, points);
      }

      return {
        histogramBySeriesId: seriesByKey as HistogramSeriesByKey<T>,
        adjustedTimeConfig: histogramResult.timeConfig,
      };
    } catch (e) {
      throw new HistogramProviderError<T>(e, {
        histogramBySeriesId: Object.fromEntries(
          Object.keys(analyticsSeries).map(serieName => [serieName, HistogramSeries.fromRawValues([], serieName)])
        ) as HistogramSeriesByKey<T>,
        adjustedTimeConfig: timeConfig,
      });
    }
  }

  private constructor() {}
  //region [[ Singleton ]]
  private static _instance: HistogramProvider | undefined;
  static get instance(): HistogramProvider {
    if (!this._instance) {
      this._instance = new HistogramProvider();
    }

    return this._instance;
  }
  //endregion
}
