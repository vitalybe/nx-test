import { ParamsMetadataType } from "../components/applicationParameters/_types/paramsMetadataTypes";

export enum Params {
  // NOTE: We put a placeholder to force the enum to be "string" enum. Placeholder can be removed once a real parameter is added
  placeholder = "placeholder",
}

export const Metadata: { [key in Params]?: ParamsMetadataType } = {
  [Params.placeholder]: {
    description: "Not used - Just an example",
    type: "boolean",
  },
};
