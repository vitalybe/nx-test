export interface BatchApiType {
  deliveryServiceIds: string[];
  dsRevisionLabel: string;
  templateId: string;
  templateRevisionId: string;
  newDsRevisionLabels: string[];
}

export interface TemplatesRevisionDetails {
  labels: string[];
  creationTimeMilli: number;
  templateRevisionId: string;
  username: string;
  creationTimeFormatted: string;
}

export interface TemplateRevisionLabelsApiType {
  labels: string[];
  templateId: string;
  templateRevisionId: string;
}

export interface TemplatesEditApiType {
  name: string;
  description: string;
}

export interface TemplatesApiType extends TemplatesEditApiType {
  templateId: string;
  ownerOrgId: string;
  templateRevisionDescriptions: TemplatesRevisionDetails[];
}

export interface TemplateRevisionEditApiType {
  templateRevisionData: object;
}

export interface TemplateRevisionVariables {
  templateVariables: { name: string }[];
}

export interface TemplateRevisionApiResult extends TemplateRevisionVariables {
  templateRevisionId: string;
  templateId: string;
  ownerOrgId: string;
  creationTimeMilli: number;
  creationTimeFormatted: string;
  username: string;
  templateRevisionData: object;
}

export type TemplatesApiResult = TemplatesApiType[];
