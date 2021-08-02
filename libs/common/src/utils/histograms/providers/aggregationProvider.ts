import { TimeConfig } from "common/utils/timeConfig";
import { AnalyticsParams, ApiAggregationType } from "common/backend/mediaAnalytics/mediaAnalyticsTypes";
import { AjaxMetadata } from "common/utils/ajax";
import { MediaAnalyticsSeries } from "common/backend/mediaAnalytics/mediaAnalyticsSeries";
import { MediaAnalyticsApi } from "common/backend/mediaAnalytics";
import { NumericValue } from "common/utils/histograms/domain/numericValue";

type MediaAnalyticsSeriesByKey = { [key: string]: MediaAnalyticsSeries };
type ValueByKey<T> = { [key in keyof T]: NumericValue };

export class AggregationProvider {
  async provide<T extends MediaAnalyticsSeriesByKey>(
    timeConfig: TimeConfig,
    analyticsSeries: T,
    additionalParams: AnalyticsParams = {},
    metadata?: AjaxMetadata
  ): Promise<{ valueBySeriesId: ValueByKey<T> }> {
    if (additionalParams.group_by !== undefined) {
      throw new Error("Unsupported");
    }

    const aggregationResult = await MediaAnalyticsApi.instance.getAggregation(
      timeConfig,
      Object.values(analyticsSeries),
      additionalParams,
      metadata
    );
    const aggregation = aggregationResult as ApiAggregationType;
    const aggregationSeries = aggregation.reports.overtime.aggregation.series;

    const seriesByKey: Partial<{ [key: string]: NumericValue }> = {};
    for (const [seriesKey, series] of Object.entries(analyticsSeries)) {
      seriesByKey[seriesKey] = new NumericValue(series.name, aggregationSeries[series.name]);
    }
    return {
      valueBySeriesId: seriesByKey as ValueByKey<T>,
      // NOTE: it should also return adjustedTimeConfig here
    };
  }

  private constructor() {}
  //region [[ Singleton ]]
  private static _instance: AggregationProvider | undefined;
  static get instance(): AggregationProvider {
    if (!this._instance) {
      this._instance = new AggregationProvider();
    }

    return this._instance;
  }
  //endregion
}
