import { ParamsMetadataType } from "../components/applicationParameters/_types/paramsMetadataTypes";

export enum Params {
  overrideNetworkTitle = "overrideNetworkTitle",

  selectedAlarmSeverity = "selectedAlarmSeverity",
  selectedSystemUpdateType = "selectedSystemUpdateType",
  systemUpdateSearch = "systemUpdateSearch",
}

export const Metadata: { [key in Params]?: ParamsMetadataType } = {};
