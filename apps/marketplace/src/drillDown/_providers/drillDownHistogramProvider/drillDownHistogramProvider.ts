import {
  AnalyticsFilterParamsEnum,
  AnalyticsGeneralParamsEnum,
  ApiHistogramGroupType,
} from "common/backend/mediaAnalytics/mediaAnalyticsTypes";
import { MarketplaceMetricDefinition, MarketplaceMetricTypes, MetricTypesEnum } from "src/_domain/metricTypes";
import {
  HistogramByType,
  HistogramTypeByEntityId,
  HistogramValue,
  HistogramValuesByDate,
} from "src/drillDown/_domain/drillDownHistogram";
import { devToolsStore } from "common/components/devTools/_stores/devToolsStore";
import { sleep } from "common/utils/sleep";
import { MediaAnalyticsApi } from "common/backend/mediaAnalytics";
import { TimeConfig } from "common/utils/timeConfig";
import { Duration } from "luxon";

interface HistogramProvider extends HistogramProviderMock {}

class HistogramProviderMock {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  provide = async (mediaAnalyticsApi: MediaAnalyticsApi, entityIds: string[], timeConfig: TimeConfig) => {
    await sleep(500);
    return HistogramByType.createMockData(entityIds);
  };
}

class HistogramProviderReal implements HistogramProvider {
  provide = async (mediaAnalyticsApi: MediaAnalyticsApi, entityIds: string[], timeConfig: TimeConfig) => {
    const bitrateTimeConfig = TimeConfig.fromDuration(
      Duration.fromMillis(timeConfig.toDate.valueOf() - timeConfig.fromDate.valueOf()),
      timeConfig.toDate,
      Duration.fromObject({ hours: 1 })
    );
    const [availableBandwidthHistogram, availableTpsHistogram, bitrateHistogram] = await Promise.all([
      mediaAnalyticsApi.getHistogram(timeConfig, MarketplaceMetricTypes.AVAILABLE_BW.analyticsSeries, {
        [AnalyticsFilterParamsEnum.GEO_IDS]: entityIds,
        [AnalyticsGeneralParamsEnum.GROUP_BY]: "geo",
      }) as Promise<{ timeConfig: TimeConfig; report: ApiHistogramGroupType }>,
      mediaAnalyticsApi.getHistogram(timeConfig, MarketplaceMetricTypes.AVAILABLE_TPS.analyticsSeries, {
        [AnalyticsFilterParamsEnum.GEO_IDS]: entityIds,
        [AnalyticsGeneralParamsEnum.GROUP_BY]: "geo",
      }) as Promise<{ timeConfig: TimeConfig; report: ApiHistogramGroupType }>,
      mediaAnalyticsApi.getHistogram(bitrateTimeConfig, MarketplaceMetricTypes.BITRATE.analyticsSeries, {
        [AnalyticsFilterParamsEnum.GEO_IDS]: entityIds,
        [AnalyticsGeneralParamsEnum.GROUP_BY]: "geo",
      }) as Promise<{ timeConfig: TimeConfig; report: ApiHistogramGroupType }>,
    ]);

    const histogramsByType = new Map<MetricTypesEnum, HistogramTypeByEntityId>();

    histogramsByType.set(
      MarketplaceMetricTypes.AVAILABLE_BW.typeEnum,
      this.provideHistogramByEntityId(
        MarketplaceMetricTypes.AVAILABLE_BW,
        entityIds,
        availableBandwidthHistogram.report
      )
    );

    histogramsByType.set(
      MarketplaceMetricTypes.AVAILABLE_TPS.typeEnum,
      this.provideHistogramByEntityId(MarketplaceMetricTypes.AVAILABLE_TPS, entityIds, availableTpsHistogram.report)
    );

    histogramsByType.set(
      MarketplaceMetricTypes.BITRATE.typeEnum,
      this.provideHistogramByEntityId(MarketplaceMetricTypes.BITRATE, entityIds, bitrateHistogram.report)
    );

    return new HistogramByType(histogramsByType);
  };

  provideHistogramByEntityId = (
    metric: MarketplaceMetricDefinition,
    entityIds: string[],
    histogram: ApiHistogramGroupType
  ): HistogramTypeByEntityId => {
    const histogramByEntityId = new Map<string, HistogramValuesByDate>();
    const bins = histogram.reports.overtime.histogram.bins;

    entityIds.forEach(entityId => {
      const histogramValueByDate = new Map<number, HistogramValue>();

      for (const bin of bins) {
        if (bin.group.geo) {
          const date = bin.timestamp * 1000;

          if (bin.group.geo[entityId]) {
            const value = metric.valueRetriever(bin.group.geo[entityId]!.series);
            histogramValueByDate.set(date, new HistogramValue(date, value));
          }
        }
      }

      histogramByEntityId.set(entityId, new HistogramValuesByDate(entityId, histogramValueByDate));
    });

    return new HistogramTypeByEntityId(metric.typeEnum, histogramByEntityId);
  };
}

export const histogramProvider: HistogramProvider = devToolsStore.isMockMode
  ? new HistogramProviderMock()
  : new HistogramProviderReal();
