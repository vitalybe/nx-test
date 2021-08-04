import { ParamsMetadataType } from "../components/applicationParameters/_types/paramsMetadataTypes";

export enum Params {
  search = "search",
}

export const Metadata: { [key in Params]?: ParamsMetadataType } = {};
