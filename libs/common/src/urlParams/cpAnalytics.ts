import { ParamsMetadataType } from "common/components/applicationParameters/_types/paramsMetadataTypes";

export enum Params {
  selectedCpId = "selectedCpId",
  selectedReportsIds = "selectedReportsIds",
  selectedSitesIds = "selectedSitesIds",
  selectedIspsIds = "selectedIspsIds",
  disabledReportsIds = "disabledReportsIds",
  focusedReportId = "focusedReportId",
  tpsBreakdownSource = "tpsBreakdownSource",
}

export const Metadata: { [key in Params]?: ParamsMetadataType } = {
  [Params.selectedCpId]: {
    type: "string",
    description: "The selected Content-Publisher ID",
  },
  [Params.selectedReportsIds]: {
    type: "string",
    description: "The selected Delegation Reports IDs",
  },
  [Params.selectedIspsIds]: {
    type: "string",
    description: "The selected Service Providers IDs",
  },
  [Params.selectedSitesIds]: {
    type: "string",
    description: "The selected Delivery Services IDs",
  },
  [Params.disabledReportsIds]: {
    type: "string",
    description: "List of disabled reports IDs",
  },
  [Params.focusedReportId]: {
    type: "string",
    description: "The focused report ID",
  },
  [Params.tpsBreakdownSource]: {
    type: "string",
    description: "The selected TPS breakdown source (qwilt / origin)",
  },
};
