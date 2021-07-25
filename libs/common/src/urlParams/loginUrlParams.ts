import { ParamsMetadataType } from "common/components/applicationParameters/_types/paramsMetadataTypes";

export enum Params {
  lockedOut = "lockedOut",
}

export const Metadata: { [key in Params]?: ParamsMetadataType } = {};
