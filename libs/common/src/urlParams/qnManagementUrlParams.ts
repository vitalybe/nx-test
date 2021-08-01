import { ParamsMetadataType } from "../components/applicationParameters/_types/paramsMetadataTypes";

export enum Params {
  tempFlag_useQnId = "tempFlag_useQnId",
}

export const Metadata: { [key in Params]: ParamsMetadataType } = {
  [Params.tempFlag_useQnId]: {
    description: "Use qn-deployment IDs (e.g 5) instead of uniqueName (e.g nwkVerizon_siteTest_etc)",
    type: "boolean",
    persistentEnvs: ["cdn-i"],
  },
};
