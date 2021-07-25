import { ParamsMetadataType } from "../components/applicationParameters/_types/paramsMetadataTypes";

export enum Params {
  createMode = "createMode",
  networkId = "networkId",
  dsMetadataId = "dsMetadataId",
}

export const Metadata: { [key in Params]?: ParamsMetadataType } = {};
