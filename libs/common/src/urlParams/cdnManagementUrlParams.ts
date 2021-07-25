import { ParamsMetadataType } from "../components/applicationParameters/_types/paramsMetadataTypes";

export enum Params {
  selectedCdnId = "selectedCdnId",
  selectedTab = "selectedTab",
  selectedDs = "selectedDs",

  monitorRoutersType = "monitorRoutersType",

  // Tab-specific filters that are reset everytime user changes tabRouter
  filter1 = "filter1",
  filter2 = "filter2",

  // workflows
  ///////////
  // if present, a user may "diff and continue" instead of the author, even if he isn't one
  workflowOverrideAuthor = "workflowOverrideAuthor",
  openWorkflowDialog = "openWorkflowDialog",

  //////////////////////////////////////////////////////////////////
  // NOTE: search in project before removal - including comments //
  /////////////////////////////////////////////////////////////////
  tempFlag_deliveryInterfaceHashFields = "tempFlag_deliveryInterfaceHashFields",
  tempFlag_cacheGroupDispersion = "tempFlag_cacheGroupDispersion",
  tempFlag_tamarDemoOnlyDsAssignments = "tempFlag_tamarDemoOnlyDsAssignments",
  tempFlag_serversTabMoreConfigurations = "tempFlag_serversTabMoreConfigurations",
  tempFlag_healthProviders = "tempFlag_healthProviders",
}

export const Metadata: { [key in Params]?: ParamsMetadataType } = {
  [Params.tempFlag_deliveryInterfaceHashFields]: {
    description: "Feature flag - Allow Delivery Interface Hash Fields",
    type: "boolean",
  },
  [Params.tempFlag_cacheGroupDispersion]: {
    description: "Feature flag - Show and edit cache group dispersion ",
    type: "boolean",
    persistentEnvs: ["cdn-i"],
  },
  [Params.tempFlag_tamarDemoOnlyDsAssignments]: {
    description: "Feature flag - For Tamar's demo",
    type: "boolean",
  },
  [Params.tempFlag_serversTabMoreConfigurations]: {
    description: "Feature flag - Allow more fields in servers to be configured",
    type: "boolean",
    persistentEnvs: ["cdn-i", "dng1", "dng2", "dtfst", "dng1", "dng2", "prod"],
  },
  [Params.tempFlag_healthProviders]: {
    description: "Feature flag - Health providers entity",
    type: "boolean",
    persistentEnvs: [],
  },
};
