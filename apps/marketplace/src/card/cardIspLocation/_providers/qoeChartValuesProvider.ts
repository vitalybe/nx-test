import { AnalyticsFilterParamsEnum, ApiHistogramBin } from "common/backend/mediaAnalytics/mediaAnalyticsTypes";
import { MarketplaceMetricTypes } from "src/_domain/metricTypes";
import { devToolsStore } from "common/components/devTools/_stores/devToolsStore";
import { TimeConfig } from "common/utils/timeConfig";
import { MediaAnalyticsApi } from "common/backend/mediaAnalytics";

interface QoeChartValuesProvider extends QoeChartValuesProviderMock {}

class QoeChartValuesProviderMock {
  async provide(entityIds: string, timeConfig: TimeConfig) {
    return [Math.pow(10, 6), Math.pow(10, 7), Math.pow(10, 8)];
  }
}

class QoeChartValuesProviderReal implements QoeChartValuesProvider {
  async provide(entityId: string, timeConfig: TimeConfig) {
    const values = [];

    const analyticsQoeHistogram = await MediaAnalyticsApi.instance.getHistogram(
      timeConfig,
      MarketplaceMetricTypes.BITRATE.analyticsSeries,
      { [AnalyticsFilterParamsEnum.GEO_IDS]: [entityId] }
    );
    for (const bin of analyticsQoeHistogram.report.reports.overtime.histogram.bins as ApiHistogramBin[]) {
      values.push(MarketplaceMetricTypes.BITRATE.valueRetriever(bin.series));
    }

    return values;
  }
}

export const qoeChartValuesProvider: QoeChartValuesProvider = devToolsStore.isMockMode
  ? new QoeChartValuesProviderMock()
  : new QoeChartValuesProviderReal();
