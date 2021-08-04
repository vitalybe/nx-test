import { ParamsMetadataType } from "common/components/applicationParameters/_types/paramsMetadataTypes";

export enum Params {
  placeholder = "placeholder",
}

export const Metadata: { [key in Params]?: ParamsMetadataType } = {};
