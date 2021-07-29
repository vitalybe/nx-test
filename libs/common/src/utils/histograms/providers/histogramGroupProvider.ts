import { TimeConfig } from "../../timeConfig";
import {
  AnalyticsFilterParamsEnum,
  AnalyticsGroupFilterToResult,
  AnalyticsParams,
  ApiHistogramGroupBin,
  ApiHistogramGroupType,
  GroupByKeys,
} from "../../../backend/mediaAnalytics/mediaAnalyticsTypes";
import { AjaxMetadata } from "../../ajax";
import { MediaAnalyticsSeries } from "../../../backend/mediaAnalytics/mediaAnalyticsSeries";
import { HistogramSeries } from "../domain/histogramSeries";
import { HistogramPoint } from "../domain/histogramPoint";
import { MediaAnalyticsApi } from "../../../backend/mediaAnalytics";

interface MediaAnalyticsSeriesByKey {
  [key: string]: MediaAnalyticsSeries;
}
type HistogramSeriesByKey<T> = { [key in keyof T]: HistogramSeries };

export interface HistogramGroupProviderResult<T> {
  adjustedTimeConfig: TimeConfig;
  histogramsByGroupId: Map<string, HistogramSeriesByKey<T>>;
}

export class HistogramGroupProviderError<T extends MediaAnalyticsSeriesByKey> extends Error {
  constructor(public originalError: Error, public blankResult: HistogramGroupProviderResult<T>) {
    super();
  }
}

export class HistogramGroupProvider {
  private getGroups(bins: ApiHistogramGroupBin[], groupByKey: keyof GroupByKeys) {
    const allGroupsIds = new Set<string>();
    for (const bin of bins) {
      const groups = bin.group[groupByKey]!;
      for (const groupId of Object.keys(groups)) {
        allGroupsIds.add(groupId);
      }
    }
    return allGroupsIds;
  }

  async provide<T extends MediaAnalyticsSeriesByKey>(
    timeConfig: TimeConfig,
    analyticsSeries: T,
    groupBy: AnalyticsFilterParamsEnum,
    additionalParams: AnalyticsParams = {},
    metadata?: AjaxMetadata
  ): Promise<HistogramGroupProviderResult<T>> {
    try {
      const histogramResult = await MediaAnalyticsApi.instance.getHistogram(
        timeConfig,
        Object.values(analyticsSeries),
        { group_by: groupBy, ...additionalParams },
        metadata
      );

      const histogram = histogramResult.report as ApiHistogramGroupType;
      const bins = histogram.reports.overtime.histogram.bins;

      const result = new Map<string, HistogramSeriesByKey<T>>();
      const groupByKey = AnalyticsGroupFilterToResult[groupBy];

      if (bins?.length > 0) {
        if (!bins[0]?.group[groupByKey]) {
          throw new Error(`groups are missing for: ${groupByKey}`);
        }
        const allGroupsIds = this.getGroups(bins, groupByKey);

        for (const groupId of allGroupsIds) {
          const seriesByKey: Partial<{ [key: string]: HistogramSeries }> = {};
          for (const [seriesKey, series] of Object.entries(analyticsSeries)) {
            const points: HistogramPoint[] = [];
            for (const bin of bins) {
              const timestampMilliseconds = bin.timestamp * 1000;

              const group = bin.group[groupByKey]![groupId];
              if (group) {
                const value: number = group?.series[series.name] ?? 0;
                points.push(new HistogramPoint(points.length, timestampMilliseconds, value));
              } else {
                // not all groups appear in all bins
                points.push(new HistogramPoint(points.length, timestampMilliseconds, 0));
              }
            }
            seriesByKey[seriesKey] = new HistogramSeries(series.name, points);
          }
          result.set(groupId, seriesByKey as HistogramSeriesByKey<T>);
        }
      }

      return { histogramsByGroupId: result, adjustedTimeConfig: histogramResult.timeConfig };
    } catch (e) {
      throw new HistogramGroupProviderError(e, { adjustedTimeConfig: timeConfig, histogramsByGroupId: new Map() });
    }
  }

  private constructor() {}
  //region [[ Singleton ]]
  private static _instance: HistogramGroupProvider | undefined;
  static get instance(): HistogramGroupProvider {
    if (!this._instance) {
      this._instance = new HistogramGroupProvider();
    }

    return this._instance;
  }
  //endregion
}
