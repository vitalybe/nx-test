import { ParamsMetadataType } from "common/components/applicationParameters/_types/paramsMetadataTypes";

export const API_OVERRIDE_PREFIX = "api_override_";

export enum CommonUrlParams {
  // time config
  duration = "duration",
  fromTimestamp = "fromTimestamp",
  toTimestamp = "toTimestamp",
  // limit the used networks/qns/sites in media-analytics
  restrictNetwork = "restrictNetwork",
  restrictOrgs = "restrictOrgs",
  restrictQn = "restrictQn",
  selectedCdnId = "selectedCdnId",
  selectedCpIds = "selectedCpIds",
  qnVersion = "qnVersion",
  timezone = "timezone",
  // general
  forceHttp = "forceHttp",
  env = "env",
  freezeTime = "freezeTime",
  mock = "mock",
  debug = "debug",
  returnTo = "returnTo",
  cache = "cache",
  services = "services",
  recordSession = "recordSession",
  hideNetworkTitle = "hideNetworkTitle",
  mockSleepTime = "mockSleepTime",
  obfuscate = "obfuscate",
  obeyPermissions = "obeyPermissions",
  forceHideInCustomerUIs = "forceHideInCustomerUIs",
  //disable all persistent params set by default on specific envs
  disablePersistentParams = "disablePersistentParams",
  // ----------
  forcePretendNotQwiltUser = "forcePretendNotQwiltUser",
}

export const commonUrlParamsMetadata: { [key in CommonUrlParams]: ParamsMetadataType } = {
  [CommonUrlParams.duration]: {
    description: "Duration of data request",
    type: "string",
  },
  [CommonUrlParams.fromTimestamp]: {
    description: "Epoch timestamp indicating the start time of data request",
    type: "number",
  },
  [CommonUrlParams.toTimestamp]: {
    description: "Epoch timestamp indicating the end time of data request",
    type: "number",
  },
  [CommonUrlParams.restrictNetwork]: {
    description: "List of Networks IDs restricting the displayed data",
    type: "array",
  },
  [CommonUrlParams.mock]: {
    description: "Turn mock mode on/off",
    type: "boolean",
  },
  [CommonUrlParams.env]: {
    description: "The current environment",
    type: "string",
  },
  [CommonUrlParams.cache]: {
    description: "cache",
    type: "string",
  },
  [CommonUrlParams.qnVersion]: {
    description: "Filter QNs by version",
    type: "string",
  },
  [CommonUrlParams.restrictQn]: {
    description: "List of QNs IDs restricting the displayed data",
    type: "array",
  },
  [CommonUrlParams.debug]: {
    description: "Turn debug mode on/off",
    type: "boolean",
  },
  [CommonUrlParams.forceHideInCustomerUIs]: {
    description: "Force hide/show of QNs with HideInNma=true (can only accept true/false)",
    type: "string",
  },
  [CommonUrlParams.forceHttp]: {
    description: "Force HTTP",
    type: "string",
  },
  [CommonUrlParams.hideNetworkTitle]: {
    description: "Turn hide network title on/off",
    type: "boolean",
  },
  [CommonUrlParams.disablePersistentParams]: {
    description: "Disable persistent URL parameters",
    type: "boolean",
  },
  [CommonUrlParams.forcePretendNotQwiltUser]: {
    description: "Force UI to treat Qwilt users as non-Qwilt users",
    type: "boolean",
  },
  [CommonUrlParams.freezeTime]: {
    description: "Set freeze time (Millis)",
    type: "number",
  },
  [CommonUrlParams.mockSleepTime]: {
    description: "Set mock sleep-time (Millis)",
    type: "number",
  },
  [CommonUrlParams.obeyPermissions]: {
    description: "Turn Obey permissions on/off",
    type: "boolean",
  },
  [CommonUrlParams.obfuscate]: {
    description: "Turn obfuscation mode on/off (real data, mock details)",
    type: "boolean",
  },
  [CommonUrlParams.recordSession]: {
    description: "Set a record session",
    type: "string",
  },
  [CommonUrlParams.restrictOrgs]: {
    description: "List of Organizations IDs restricting the displayed data",
    type: "array",
  },
  [CommonUrlParams.returnTo]: {
    description: "Set redirect after login",
    type: "string",
  },
  [CommonUrlParams.selectedCdnId]: {
    description: "The selected CDN ID",
    type: "string",
  },
  [CommonUrlParams.selectedCpIds]: {
    description: "List of selected Content Publishers IDs restricting the displayed data",
    type: "string",
  },
  [CommonUrlParams.timezone]: {
    description: "Override default timezone",
    type: "string",
  },
  [CommonUrlParams.services]: {
    description: "services ?",
    type: "string",
  },
};
