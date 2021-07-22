import { ParamsMetadataType } from "common/components/applicationParameters/_types/paramsMetadataTypes";

export enum Params {
  dsDashboardViewMode = "viewMode",
  selectedCpIds = "selectedCpIds",
  selectedTreeId = "selectedTreeId",
  showBitrateChart = "showBitrateChart",
  // used by DT to illustrate different amount of data (DS-Dashboard-CP)
  requestCountMultiply = "requestCountMultiply",
}

export const Metadata: { [key in Params]?: ParamsMetadataType } = {};
