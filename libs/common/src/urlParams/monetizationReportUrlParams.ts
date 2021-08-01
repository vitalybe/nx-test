import { ParamsMetadataType } from "../components/applicationParameters/_types/paramsMetadataTypes";

export enum Params {
  selectedSpOrg = "selectedSpOrg",
  selectedReport = "selectedReport",
  selectedPublishers = "selectedPublishers",
  selectedProjects = "selectedProjects",
  historyVisible = "historyVisible",
}

export const Metadata: { [key in Params]?: ParamsMetadataType } = {
  [Params.historyVisible]: {
    description: "Whether History sidebar is shown",
    type: "boolean",
  },
};
