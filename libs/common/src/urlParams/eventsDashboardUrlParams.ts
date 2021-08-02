import { ParamsMetadataType } from "common/components/applicationParameters/_types/paramsMetadataTypes";

export enum Params {
  duration = "duration",
  fromTimestamp = "fromTimestamp",
  toTimestamp = "toTimestamp",
  filter = "filter",
  severityFilter = "severityFilter",
  typeFilter = "typeFilter",
}

export const Metadata: { [key in Params]?: ParamsMetadataType } = {};
