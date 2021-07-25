import { ParamsMetadataType } from "common/components/applicationParameters/_types/paramsMetadataTypes";

export enum Params {
  restrictByIspService = "restrictByIspService",
  tempFlag_utilization = "tempFlag_utilization",
  selectedTreeId = "selectedTreeId",
}

export const Metadata: { [key in Params]?: ParamsMetadataType } = {
  [Params.tempFlag_utilization]: {
    description: "Enable utilization UI",
    type: "boolean",
    persistentEnvs: ["cdn-i"],
  },
};
