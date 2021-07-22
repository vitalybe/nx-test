export interface QnConfigMappingApiEditType {
  // null for default
  qnDeploymentId: string | null;
  phase: {
    config: {
      fragmentBody: string;
    };
  };
}

export interface QnConfigMappingApiType extends QnConfigMappingApiEditType {
  mappingId: string;
}

export interface QnConfigMappingApiResult {
  mappings: QnConfigMappingApiType[];
}

export const DefaultMappingId = "default" as const;

export interface QnConfigHierarchyApiType {
  mappings: [string | typeof DefaultMappingId];
  // null for default
  qnDeploymentId: string | null;
  phase: {
    config: {
      fragmentBody: string | null;
      completeFragmentBody: string;
      completeFragmentSourceMapping: string;
    };
  };
  inherits: [QnConfigHierarchyApiType | null];
}

export interface QnConfigHierarchyApiResult {
  hierarchies: [QnConfigHierarchyApiType];
}
