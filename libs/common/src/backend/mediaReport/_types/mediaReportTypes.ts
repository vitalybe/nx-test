import { ParamValue } from "../../_utils/urlParams";

export interface MediaReportApiResult {
  response: MediaReportResponseType[];
}

export interface MediaReportResponseType {
  groupByValue: "all" | string;
  data: MediaReportDataApiType[];
}

export interface MediaReportDataApiType {
  stats: MediaReportStatsApiType;
  dimensions: MediaReportDimensionsApiType;
  histogram: MediaReportBinApiType[];
}

export interface MediaReportDimensionsApiType {
  deliveredBy?: "QWILT" | "ORIGIN";
  code?: string;
}

interface MediaReportStatsApiType {
  max: MediaReportBinApiType;
  min: MediaReportBinApiType;
}

interface MediaReportBinApiType {
  timestamp: number;
  value: number;
}

export type MediaReportParams = { [param in MediaReportParamsEnum]?: ParamValue };

export enum MediaReportParamsEnum {
  FROM_DATE = "from",
  TO_DATE = "to",
  INTERVAL = "interval",

  GROUP_BY = "groupBy",
  SITES = "sites",
  ISPS = "isps",
  TOP = "top",
  DELEGATION_TARGETS = "delegationTargets",
  DIMENSIONS = "dimensions",
  CP_IDS = "cpIds",
  SPLIT_STATUS_CODE_CLASSES = "splitStatusCodeClasses",
}

export enum MediaReportTypeEnum {
  BANDWIDTH = "bandwidth",
  VOLUME = "volume",
  AVG_BITRATE = "avgBitrate",
  TRANSACTION_COUNT = "transactionCount",
  TPS = "tps",
}
