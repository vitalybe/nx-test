import { ParamsMetadataType } from "../components/applicationParameters/_types/paramsMetadataTypes";

export enum Params {
  dsId = "dsId",
  dsPurgeType = "dsPurgeType",
  tempFlag_revisionDeletion = "tempFlag_revisionDeletion",
}

export const Metadata: { [key in Params]?: ParamsMetadataType } = {
  [Params.tempFlag_revisionDeletion]: {
    type: "boolean",
    description: "Feature Flag: Toggle revision deletion feature",
  },
};
