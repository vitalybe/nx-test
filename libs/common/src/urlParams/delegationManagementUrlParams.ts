import { ParamsMetadataType } from "common/components/applicationParameters/_types/paramsMetadataTypes";

export enum Params {
  filter = "filter",
  tempFlag_dsDropdown = "tempFlag_dsDropdown",
  tempFlag_healthCollectors = "tempFlag_healthCollectors",
}

export const Metadata: { [key in Params]?: ParamsMetadataType } = {
  [Params.tempFlag_dsDropdown]: {
    description: "Allow editing of DS",
    type: "boolean",
  },
  [Params.tempFlag_healthCollectors]: {
    description: "Health Collector server type",
    type: "boolean",
  },
};
