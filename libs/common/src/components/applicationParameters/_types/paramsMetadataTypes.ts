export type ParamsMetadata = { [param: string]: ParamsMetadataType | undefined };

export interface ParamsMetadataType {
  description: string;
  type: ParamType;
  persistentEnvs?: string[];
}

export type ParamType = "array" | "boolean" | "string" | "number";
