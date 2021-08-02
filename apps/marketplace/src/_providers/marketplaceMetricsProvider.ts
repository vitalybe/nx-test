import {
  AnalyticsFilterParamsEnum,
  ApiAggregationType,
  ApiHistogramType,
} from "@qwilt/common/backend/mediaAnalytics/mediaAnalyticsTypes";
import { MarketplaceMetricTypes } from "../_domain/metricTypes";
import { MarketplaceMetrics } from "../_domain/marketplaceMetrics";
import { geoDeploymentApi } from "@qwilt/common/backend/geoDeployment/geoDeploymentApi";
import { devToolsStore } from "@qwilt/common/components/devTools/_stores/devToolsStore";
import { AjaxMetadata } from "@qwilt/common/utils/ajax";
import { TimeConfig } from "@qwilt/common/utils/timeConfig";
import { MediaAnalyticsApi } from "@qwilt/common/backend/mediaAnalytics";
import { oc } from "ts-optchain";

interface MarketplaceMetricsProvider extends MarketplaceMetricsProviderMock {}

class MarketplaceMetricsProviderMock {
  async provide(entityIds: string[], timeConfig: TimeConfig) {
    return MarketplaceMetrics.createMock();
  }
}

class MarketplaceMetricsProviderReal implements MarketplaceMetricsProvider {
  async provide(entityIds: string[], timeConfig: TimeConfig) {
    const ajaxMetadata = new AjaxMetadata(true);

    const [availableTpsHistogram, availableBwHistogram, bitrateAggregation, coverageAggregation] = await Promise.all([
      MediaAnalyticsApi.instance.getHistogram(
        timeConfig,
        MarketplaceMetricTypes.AVAILABLE_TPS.analyticsSeries,
        {
          [AnalyticsFilterParamsEnum.GEO_IDS]: entityIds,
        },
        ajaxMetadata
      ) as Promise<{ timeConfig: TimeConfig; report: ApiHistogramType }>,

      MediaAnalyticsApi.instance.getHistogram(
        timeConfig,
        MarketplaceMetricTypes.AVAILABLE_BW.analyticsSeries,
        {
          [AnalyticsFilterParamsEnum.GEO_IDS]: entityIds,
        },
        ajaxMetadata
      ) as Promise<{ timeConfig: TimeConfig; report: ApiHistogramType }>,

      MediaAnalyticsApi.instance.getAggregation(
        timeConfig,
        MarketplaceMetricTypes.BITRATE.analyticsSeries,
        {
          [AnalyticsFilterParamsEnum.GEO_IDS]: entityIds,
        },
        ajaxMetadata
      ) as Promise<ApiAggregationType>,

      geoDeploymentApi.getCoverage(entityIds, ajaxMetadata),
    ]);

    const availableBwSeries = oc(availableBwHistogram).report.reports.overtime.histogram.stats.statsResults.max.series(
      {}
    );
    const availableTpsSeries = oc(
      availableTpsHistogram
    ).report.reports.overtime.histogram.stats.statsResults.min.series({});

    const avgBitrateSeries = bitrateAggregation.reports.overtime.aggregation.series;

    const { bandwidth, tps, avgBitrate, coverage } = {
      bandwidth: MarketplaceMetricTypes.AVAILABLE_BW.valueRetriever(availableBwSeries),
      tps: MarketplaceMetricTypes.AVAILABLE_TPS.valueRetriever(availableTpsSeries),
      avgBitrate: MarketplaceMetricTypes.BITRATE.valueRetriever(avgBitrateSeries),
      coverage: coverageAggregation.coveragePercentage,
    };

    return new MarketplaceMetrics(bandwidth, tps, avgBitrate, coverage);
  }
}

export const marketplaceMetricsProvider: MarketplaceMetricsProvider = devToolsStore.isMockMode
  ? new MarketplaceMetricsProviderMock()
  : new MarketplaceMetricsProviderReal();
