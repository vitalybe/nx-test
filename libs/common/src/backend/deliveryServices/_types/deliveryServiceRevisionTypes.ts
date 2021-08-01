export interface DeliveryServiceRevisionApiResult {
  sampleData: string;
}

export type ValidTypes = string | boolean | number | object | null;

export interface TemplateVariablesType {
  name: string;
  value: ValidTypes;
}

export interface RevisionApiType extends RevisionEditApiType {
  dsId: string;
  apiVersion: string;
  dsRevisionId: string;
  creationTime: Date;
  creationTimeMilli: number;
  creationTimeFormatted: string;
  username?: string;
}

export interface RevisionLabelsApiType {
  labels: string[];
  dsId: string;
  dsRevisionId: string;
}

export interface ServiceTokensType {
  urlLocation: string;
  value: string;
}

export interface RevisionEditApiType {
  serviceType: "live" | "vod" | "software" | "other";
  protocols: ("http" | "https")[];
  httpVersions: ("http/1.1" | "http/2")[];
  redirectHttpToHttps: { enabled: boolean };
  redirectRouting: { enabled: boolean };
  manifestRewriteRouting: { enabled: boolean };
  serviceToken: string;
  serviceTokens?: ServiceTokensType[];
  identification?: object;
  nameResolution?: object;
  components: object[];
  unidentifiedComponent?: object;
  origin?: object;
  fallback?: object;
  ownerOrgId: string;
  debug?: object;
  rawJson?: object;
  userData?: object;
  templateId?: string | null;
  templateRevisionId?: string | null;
  templateVariables?: TemplateVariablesType[] | null;
  dsMetadata?: object;
}
