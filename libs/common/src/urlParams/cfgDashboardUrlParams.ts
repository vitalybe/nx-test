import { ParamsMetadataType } from "../components/applicationParameters/_types/paramsMetadataTypes";

export enum Params {
  csmHostnamePrefix = "csmHostnamePrefix",
  filter = "filter",
  filterByUnreported = "filterByUnreported",
  monitoringState = "monitoringState",
  parcelsFilter = "parcelsFilter",
  parcelState = "parcelState",
  selectedCdnId = "selectedCdnId",
  selectedWorkflowId = "selectedWorkflowId",
  sortWorkflowsBy = "sortWorkflowsBy",
}

export const Metadata: { [key in Params]?: ParamsMetadataType } = {};
