import { ParamsMetadataType } from "common/components/applicationParameters/_types/paramsMetadataTypes";

export enum Params {
  selectedReport = "selectedReport",
  historyVisible = "historyVisible",
  selectedCpOrg = "selectedCpOrg",
  selectedSps = "selectedSps",
}

export const Metadata: { [key in Params]?: ParamsMetadataType } = {
  [Params.historyVisible]: {
    description: "Whether History sidebar is shown",
    type: "boolean",
  },
};
