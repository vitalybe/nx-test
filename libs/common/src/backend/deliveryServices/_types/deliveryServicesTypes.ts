export type DeliveryServicesMatchType = "HOST_REGEXP" | "PATH_REGEXP";

export type JsonSchemaTypes = "string" | "number" | "object" | "array" | "boolean" | "null";

export interface DeliveryServicesApiDocsType {
  definitions: DeliveryServicesApiDocsSchemaType;
}

export interface DeliveryServicesApiDocsSchemaType {
  [key: string]: {
    $ref?: string;
    title?: string;
    type: JsonSchemaTypes;
    properties?: DeliveryServicesApiDocsSchemaType;
    description?: string;
    required?: string[];
  };
}

export interface RevisionDescriptionApiType {
  dsRevisionId: string;
  creationTimeMilli: number;
  creationTimeFormatted: string;
  username?: string;
  labels: string[];
}

export interface DeliveryServicesEditApiType {
  name: string;
  description: string;
  isActive: boolean;
  userData: object;
  metadataId?: string;
}

export interface DeliveryServicesApiType extends DeliveryServicesEditApiType {
  dsId: string;
  ownerOrgId: string;
  apiVersion: string;
  links: unknown[];
  dsRevisionDescriptions: RevisionDescriptionApiType[] | null;
}

// label: revisionId
export type DeliveryServicesLabelsApiType = { [label: string]: string };

export type DeliveryServicesApiResult = DeliveryServicesApiType[];
