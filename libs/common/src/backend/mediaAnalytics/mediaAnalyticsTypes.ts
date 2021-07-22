import { ParamValue } from "common/backend/_utils/urlParams";

export type ApiReportType =
  | ApiHistogramType
  | ApiHistogramGroupType
  | ApiAggregationType
  | ApiAggregationGroupType
  | ApiPercentileType;
export type ApiHistogramType = ApiReport<ApiHistogramReport<ApiHistogram>>;
export type ApiPercentileType = ApiReport<ApiPercentiles>;
export type ApiHistogramGroupType = ApiReport<ApiHistogramReport<ApiHistogramGroup>>;
export type ApiAggregationType = ApiReport<ApiAggregationReport<ApiAggregation>>;
export type ApiAggregationGroupType = ApiReport<ApiAggregationReport<ApiGroupByAggregation>>;

export interface ApiSeriesGranularityData {
  dataInterval: number;
  fromPeriodSeconds: number;
  toPeriodSeconds: number;
}

export interface ErrorStatusApiType {
  error?: boolean;
  status?: string;
  message?: string;
}

export interface ApiMinimumBinIntervals extends ErrorStatusApiType {
  series: {
    [key: string]: {
      granularity: ApiSeriesGranularityData[];
    };
  };
}

interface ApiReport<ReportType> extends ErrorStatusApiType {
  debug?: {};
  reports: {
    overtime: ReportType;
  };
  ["#"]?: string;
}

export interface ApiHistogramReport<HistogramType> {
  histogram: HistogramType;
}

export interface ApiHistogram {
  bins: ApiHistogramBin[];
  stats: null | ApiHistogramStatsList;
}
export interface ApiPercentiles {
  percentiles: {
    percentile: Record<string, { percentile: number; series: ApiSeries }>;
  };
}

export interface ApiHistogramGroup {
  bins: ApiHistogramGroupBin[];
  stats: null | ApiHistogramGroupStatsList;
}

export interface ApiHistogramGroupStatsList {
  group: {
    [itemId: string]: ApiHistogramStatsList;
  };
}

export interface ApiDetailedSeriesStat {
  timestamp: number;
  value: number;
}
export interface ApiHistogramStatsList {
  detailedStatsResults: {
    [stat in AnalyticsHistogramStatsEnum]: {
      series: {
        [key: string]: ApiDetailedSeriesStat;
      };
    };
  };
  statsResults: { [stat in AnalyticsHistogramStatsEnum]: { series: ApiSeries } };
}

export interface ApiHistogramBinCommon {
  timestamp: number;
  docCount?: number;
}

export interface ApiHistogramBin extends ApiHistogramBinCommon {
  series: ApiSeries;
  missingData: boolean;
}
export interface ApiHistogramGroupBin extends ApiHistogramBinCommon {
  group: {
    [K in keyof GroupByKeys]: {
      [itemName: string]: GroupByKeys[K];
    };
  };
  total?: unknown;
}

export interface ApiAggregationReport<AggregationType> {
  aggregation: AggregationType;
}
export interface ApiGroupByAggregation {
  group: {
    [K in keyof GroupByKeys]: {
      [itemName: string]: GroupByKeys[K];
    };
  };
  total?: {
    allSites?: {
      series: ApiSeries;
      missingData: boolean;
    };
  };
}
export interface ApiAggregation {
  series: ApiSeries;
}

export interface ApiSeries {
  [key: string]: number;
}

interface GroupMembers {
  series: ApiSeries;
  rank?: number;
  missingData: boolean;
}
export interface GroupByKeys {
  geo?: GroupMembers;
  system?: GroupMembers;
  site?: GroupMembers;
  dsg?: GroupMembers;
  isp?: GroupMembers;
}

export enum AnalyticsReportTypeEnum {
  AGGREGATION = "aggregation",
  HISTOGRAM = "histogram",
  PERCENTILE = "percentiles",
  METADATA = "metadata",
}

export type AnalyticsParams = { [param in AnalyticsParamsType]?: ParamValue };

export type AnalyticsParamsType = AnalyticsGeneralParamsEnum | AnalyticsFilterParamsEnum;

export enum AnalyticsGeneralParamsEnum {
  FROM_DATE = "from",
  TO_DATE = "to",

  SERIES = "series",
  BIN_INTERVAL = "bin_interval",
  GROUP_BY = "group_by",
  ORDER_BY = "order_by",

  STATS = "stats",
  TOTALS = "totals",
  TOP = "top",
  EXCLUDE_BINS = "exclude_bins",
  DEBUG = "debug",

  PERCENTILES = "percentiles",
}

export enum AnalyticsFilterParamsEnum {
  SYSTEM_IDS = "systems",
  GEO_IDS = "geos",
  DSGS = "dsgs",
  SITES = "sites",
  ISPS = "isps",
}

export const AnalyticsGroupFilterToResult: { [key in AnalyticsFilterParamsEnum]: keyof GroupByKeys } = {
  [AnalyticsFilterParamsEnum.SYSTEM_IDS]: "system",
  [AnalyticsFilterParamsEnum.DSGS]: "dsg",
  [AnalyticsFilterParamsEnum.GEO_IDS]: "geo",
  [AnalyticsFilterParamsEnum.SITES]: "site",
  [AnalyticsFilterParamsEnum.ISPS]: "isp",
};

export enum AnalyticsHistogramStatsEnum {
  MAX = "max",
  MIN = "min",
}
