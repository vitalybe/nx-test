import { ParamsMetadataType } from "common/components/applicationParameters/_types/paramsMetadataTypes";

export enum Params {
  selectedSps = "selectedSps",
  selectedReport = "selectedReport",
  selectedProjects = "selectedProjects",
  historyVisible = "historyVisible",
}

export const Metadata: { [key in Params]?: ParamsMetadataType } = {
  [Params.historyVisible]: {
    description: "Whether History sidebar is shown",
    type: "boolean",
  },
};
