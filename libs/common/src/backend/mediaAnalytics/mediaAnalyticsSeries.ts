import * as _ from "lodash";
import { DateTime, Duration, Interval } from "luxon";
import { ApiMinimumBinIntervals } from "./mediaAnalyticsTypes";

export enum SeriesGroupEnum {
  BASIC,
  PER_SITE,
  PER_SITE_1MIN,
  QOE,
}

// maximum amount of seconds to the past that Luxon works with
const MAX_TO_PERIOD_SECONDS = 100000000000;

export class MediaAnalyticsSeries {
  private constructor(public name: string, public group: SeriesGroupEnum) {}

  async getMinimumBinInterval(
    toDate: DateTime,
    duration: Duration,
    seriesGranularities: ApiMinimumBinIntervals
  ): Promise<number | undefined> {
    const fromDate = toDate.minus(duration);

    const seriesInfo = seriesGranularities.series[this.name];
    if (seriesInfo && seriesInfo.granularity.length > 0) {
      const granularities = _.orderBy(seriesInfo.granularity, granularity => granularity.fromPeriodSeconds, "desc");
      for (const granularity of granularities) {
        const now = DateTime.local();
        // NOTE: it is reversed on purpose `fromPeriodSeconds` and `toPeriodSeconds` are reversed in this API
        const fromPeriodSeconds = Math.min(granularity.fromPeriodSeconds, MAX_TO_PERIOD_SECONDS);
        const to = now.minus(Duration.fromObject({ second: fromPeriodSeconds }));
        const toPeriodSeconds = Math.min(granularity.toPeriodSeconds, MAX_TO_PERIOD_SECONDS);
        const from = now.minus(Duration.fromObject({ second: Math.min(MAX_TO_PERIOD_SECONDS, toPeriodSeconds) }));
        const granularityInterval = Interval.fromDateTimes(from, to);

        if (granularityInterval.contains(fromDate)) {
          return granularity.dataInterval;
        }
      }

      throw new Error(`failed to find minimum binInterval`);
    }

    throw new Error(`failed to find info for series: ${this.name}`);
  }

  // Bitrate
  static readonly SERVED_BITRATE = new MediaAnalyticsSeries("servedBitrate", SeriesGroupEnum.QOE);
  static readonly SERVED_BITRATE_1MIN = new MediaAnalyticsSeries("servedBitrate1Min", SeriesGroupEnum.QOE);
  static readonly AVERAGE_STREAMED_BITRATE = new MediaAnalyticsSeries("averageStreamedBitrate", SeriesGroupEnum.QOE);
  static readonly AVERAGE_STREAMED_BITRATE_1MIN = new MediaAnalyticsSeries(
    "averageStreamedBitrate1Min",
    SeriesGroupEnum.QOE
  );

  // Subs
  static readonly SUBSCRIBERS = new MediaAnalyticsSeries("subscribers", SeriesGroupEnum.QOE);
  static readonly SUBSCRIBERS_1MIN = new MediaAnalyticsSeries("subscribers1Min", SeriesGroupEnum.QOE);

  // Bandwidth
  static readonly L2_BW_DELIVERED = new MediaAnalyticsSeries("l2BwDelivered", SeriesGroupEnum.BASIC);
  static readonly L7_BW_VIDEO_LOCAL_DELIVERY_PER_SITE_1MIN = new MediaAnalyticsSeries(
    "l7BwVideoLocalDeliveryPerSite1Min",
    SeriesGroupEnum.PER_SITE_1MIN
  );
  static readonly L2_BW_BY_CONTENT_PROVIDER = new MediaAnalyticsSeries("l2BwByContentProvider", SeriesGroupEnum.BASIC);
  static readonly L7_BW_VIDEO_BY_CONTENT_PROVIDER_PER_SITE_1MIN = new MediaAnalyticsSeries(
    "l7BwVideoByContentProviderPerSite1Min",
    SeriesGroupEnum.PER_SITE_1MIN
  );
  static readonly L2_BW_NON_CACHEABLE = new MediaAnalyticsSeries("l2BwNonCacheable", SeriesGroupEnum.BASIC);
  static readonly L2_BW_TOTAL = new MediaAnalyticsSeries("l2BwTotal", SeriesGroupEnum.BASIC);
  static readonly L2_BW_CACHEABLE = new MediaAnalyticsSeries("l2BwCacheable", SeriesGroupEnum.BASIC);

  static readonly L2_AVAILABLE_BW_CAPACITY = new MediaAnalyticsSeries("l2AvailableBwCapacity", SeriesGroupEnum.BASIC);

  static readonly L2_BW_ODCI_FROM_ORIGIN = new MediaAnalyticsSeries("l2BwOdciFromOrigin", SeriesGroupEnum.BASIC);
  static readonly L7_BW_VIDEO_BY_ODCI_FROM_ORIGIN_PER_SITE_1MIN = new MediaAnalyticsSeries(
    "l7BwVideoByOdciFromOriginPerSite1Min",
    SeriesGroupEnum.PER_SITE_1MIN
  );
  static readonly L2_BW_ODCI_FROM_MID_LOCAL = new MediaAnalyticsSeries("l2BwOdciFromMidLocal", SeriesGroupEnum.BASIC);
  static readonly L7_BW_VIDEO_BY_ODCI_FROM_MID_LOCAL_PER_SITE_1MIN = new MediaAnalyticsSeries(
    "l7BwVideoByOdciFromMidLocalPerSite1Min",
    SeriesGroupEnum.PER_SITE_1MIN
  );

  // Transactions
  static readonly TOTAL_TPS_CAPACITY = new MediaAnalyticsSeries("totalTpsCapacity", SeriesGroupEnum.BASIC);
  static readonly TRANSACTIONS_PER_SECOND_DELIVERY_PER_SITE = new MediaAnalyticsSeries(
    "transactionsPerSecondDeliveryPerSite",
    SeriesGroupEnum.BASIC
  );
  static readonly TRANSACTIONS_PER_SECOND_ORIGIN_PER_SITE = new MediaAnalyticsSeries(
    "transactionsPerSecondOriginPerSite",
    SeriesGroupEnum.BASIC
  );
  static readonly REJECTED_BY_RM_LINE_TPS = new MediaAnalyticsSeries("rejectedByRmLineTps", SeriesGroupEnum.BASIC);
  static readonly TRANSACTIONS_PER_SECOND_2XX_DELIVERY_PER_SITE = new MediaAnalyticsSeries(
    "transactionsPerSecond2xxDeliveryPerSite",
    SeriesGroupEnum.BASIC
  );
  static readonly TRANSACTIONS_PER_SECOND_2XX_ORIGIN_PER_SITE = new MediaAnalyticsSeries(
    "transactionsPerSecond2xxOriginPerSite",
    SeriesGroupEnum.BASIC
  );
  static readonly TRANSACTIONS_PER_SECOND_3XX_DELIVERY_PER_SITE = new MediaAnalyticsSeries(
    "transactionsPerSecond3xxDeliveryPerSite",
    SeriesGroupEnum.BASIC
  );
  static readonly TRANSACTIONS_PER_SECOND_3XX_ORIGIN_PER_SITE = new MediaAnalyticsSeries(
    "transactionsPerSecond3xxOriginPerSite",
    SeriesGroupEnum.BASIC
  );
  static readonly TRANSACTIONS_PER_SECOND_4XX_DELIVERY_PER_SITE = new MediaAnalyticsSeries(
    "transactionsPerSecond4xxDeliveryPerSite",
    SeriesGroupEnum.BASIC
  );
  static readonly TRANSACTIONS_PER_SECOND_4XX_ORIGIN_PER_SITE = new MediaAnalyticsSeries(
    "transactionsPerSecond4xxOriginPerSite",
    SeriesGroupEnum.BASIC
  );
  static readonly TRANSACTIONS_PER_SECOND_5XX_DELIVERY_PER_SITE = new MediaAnalyticsSeries(
    "transactionsPerSecond5xxDeliveryPerSite",
    SeriesGroupEnum.BASIC
  );
  static readonly TRANSACTIONS_PER_SECOND_5XX_ORIGIN_PER_SITE = new MediaAnalyticsSeries(
    "transactionsPerSecond5xxOriginPerSite",
    SeriesGroupEnum.BASIC
  );
  // region [[ CACHED / NON CACHED ]]
  // by qwilt non cached
  static readonly TRANSACTIONS_PER_SECOND_2XX_QWILT_NON_CACHED = new MediaAnalyticsSeries(
    "transactionsPerSecond2xxSelfGeneratedDeliveryPerSite",
    SeriesGroupEnum.BASIC
  );

  static readonly TRANSACTIONS_PER_SECOND_3XX_QWILT_NON_CACHED = new MediaAnalyticsSeries(
    "transactionsPerSecond3xxSelfGeneratedDeliveryPerSite",
    SeriesGroupEnum.BASIC
  );

  static readonly TRANSACTIONS_PER_SECOND_4XX_QWILT_NON_CACHED = new MediaAnalyticsSeries(
    "transactionsPerSecond4xxSelfGeneratedDeliveryPerSite",
    SeriesGroupEnum.BASIC
  );

  static readonly TRANSACTIONS_PER_SECOND_5XX_QWILT_NON_CACHED = new MediaAnalyticsSeries(
    "transactionsPerSecond5xxSelfGeneratedDeliveryPerSite",
    SeriesGroupEnum.BASIC
  );
  static readonly TRANSACTIONS_PER_SECOND_2XX_ORIGIN_CACHED = new MediaAnalyticsSeries(
    "transactionsPerSecond2xxCachedDeliveryPerSite",
    SeriesGroupEnum.BASIC
  );
  // origin cached - to get origin non cached subtract this series from origin's total transactions (
  static readonly TRANSACTIONS_PER_SECOND_3XX_ORIGIN_CACHED = new MediaAnalyticsSeries(
    "transactionsPerSecond3xxCachedDeliveryPerSite",
    SeriesGroupEnum.BASIC
  );

  static readonly TRANSACTIONS_PER_SECOND_4XX_ORIGIN_CACHED = new MediaAnalyticsSeries(
    "transactionsPerSecond4xxCachedDeliveryPerSite",
    SeriesGroupEnum.BASIC
  );

  static readonly TRANSACTIONS_PER_SECOND_5XX_ORIGIN_CACHED = new MediaAnalyticsSeries(
    "transactionsPerSecond5xxCachedDeliveryPerSite",
    SeriesGroupEnum.BASIC
  );

  // l7 Volume
  static readonly L7_VOLUME_TOTAL = new MediaAnalyticsSeries("l7VideoTotal", SeriesGroupEnum.BASIC);
  static readonly L7_VIDEO_TOTAL_PER_SITE = new MediaAnalyticsSeries("l7VideoTotalPerSite", SeriesGroupEnum.PER_SITE);
  static readonly L7_VIDEO_TOTAL_PER_SITE_5MIN = new MediaAnalyticsSeries(
    "l7VideoTotalPerSite5Min",
    SeriesGroupEnum.PER_SITE
  );
  static readonly L7_VIDEO_TOTAL_PER_SITE_1MIN = new MediaAnalyticsSeries(
    "l7VideoTotalPerSite1Min",
    SeriesGroupEnum.PER_SITE_1MIN
  );
  static readonly L7_VIDEO_LOCAL_DELIVERY_PER_SITE = new MediaAnalyticsSeries(
    "l7VideoLocalDeliveryPerSite",
    SeriesGroupEnum.PER_SITE
  );
  static readonly L7_VIDEO_BY_CONTENT_PROVIDER_PER_SITE = new MediaAnalyticsSeries(
    "l7VideoByContentProviderPerSite",
    SeriesGroupEnum.PER_SITE
  );
  static readonly L7_VIDEO_BY_CONTENT_PROVIDER_PER_SITE_1MIN = new MediaAnalyticsSeries(
    "l7VideoByContentProviderPerSite1Min",
    SeriesGroupEnum.PER_SITE_1MIN
  );
  static readonly L7_VIDEO_BY_ODCI_FROM_ORIGIN_PER_SITE_1MIN = new MediaAnalyticsSeries(
    "l7VideoByOdciFromOriginPerSite1Min",
    SeriesGroupEnum.PER_SITE_1MIN
  );
  static readonly L7_VIDEO_LOCAL_DELIVERY_PER_SITE_1MIN = new MediaAnalyticsSeries(
    "l7VideoLocalDeliveryPerSite1Min",
    SeriesGroupEnum.PER_SITE_1MIN
  );

  // l2 Volume
  static readonly L2_DELIVERED = new MediaAnalyticsSeries("l2Delivered", SeriesGroupEnum.BASIC);
  static readonly L2_BY_CONTENT_PROVIDER = new MediaAnalyticsSeries("l2ByContentProvider", SeriesGroupEnum.BASIC);
  static readonly L2_TOTAL = new MediaAnalyticsSeries("l2Total", SeriesGroupEnum.BASIC);
  static readonly L2_CACHEABLE = new MediaAnalyticsSeries("l2Cacheable", SeriesGroupEnum.BASIC);

  // Asymmetric Volume
  static readonly L7_ASYMETRIC_VIDEO = new MediaAnalyticsSeries("l7AsymetricVideo", SeriesGroupEnum.BASIC);
}
