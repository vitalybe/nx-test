import { MediaAnalyticsSeries } from "common/backend/mediaAnalytics/mediaAnalyticsSeries";
import { ApiSeries } from "common/backend/mediaAnalytics/mediaAnalyticsTypes";

export enum MetricTypesEnum {
  AVAILABLE_BW,
  AVAILABLE_TPS,
  BITRATE,
}

export class MarketplaceMetricDefinition {
  constructor(
    public typeEnum: MetricTypesEnum,
    public analyticsSeries: MediaAnalyticsSeries[],
    public valueRetriever: (seriesObj: ApiSeries) => number
  ) {}
}

export class MarketplaceMetricTypes {
  static getAll(): MarketplaceMetricDefinition[] {
    return Object.values(MarketplaceMetricTypes).filter(val => val instanceof MarketplaceMetricDefinition);
  }

  static AVAILABLE_BW = new MarketplaceMetricDefinition(
    MetricTypesEnum.AVAILABLE_BW,
    [MediaAnalyticsSeries.L2_AVAILABLE_BW_CAPACITY],
    seriesObj => seriesObj[MediaAnalyticsSeries.L2_AVAILABLE_BW_CAPACITY.name]
  );

  static AVAILABLE_TPS = new MarketplaceMetricDefinition(
    MetricTypesEnum.AVAILABLE_TPS,
    [MediaAnalyticsSeries.TOTAL_TPS_CAPACITY, MediaAnalyticsSeries.TRANSACTIONS_PER_SECOND_DELIVERY_PER_SITE],
    seriesObj =>
      seriesObj[MediaAnalyticsSeries.TOTAL_TPS_CAPACITY.name] -
      seriesObj[MediaAnalyticsSeries.TRANSACTIONS_PER_SECOND_DELIVERY_PER_SITE.name]
  );

  static BITRATE = new MarketplaceMetricDefinition(
    MetricTypesEnum.BITRATE,
    [MediaAnalyticsSeries.SERVED_BITRATE],
    seriesObj => seriesObj[MediaAnalyticsSeries.SERVED_BITRATE.name]
  );
}
