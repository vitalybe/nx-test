export enum UrlParameterTypeEnum {
  ///////////////////////////////////////////////////////////////////////
  // NOTE: Do *NOT* add new items here, new items should be added to
  // project's Url Parameter Enum (common/urlParams/<projectName>Params.ts) and used via ProjectUrlStore
  // This file is should contain only common parameter types in the future
  ///////////////////////////////////////////////////////////////////////

  marketplaceMoreDetailsId = "marketplaceMoreDetailsId",
  marketplaceSelectedEntitiesIds = "marketplaceSelectedEntitiesIds",
  marketplaceEnabledEntitiesIds = "marketplaceEnabledEntitiesIds",
  marketplaceIsDrillDownOpen = "marketplaceIsDrillDownOpen",
  // ----------
  opsHiddenSeries = "opsHiddenSeries",
  opsEnabledLayers = "opsEnabledLayers",
  opsLegacyMode = "opsLegacyMode",
  opsIsolatedService = "opsIsolatedService",
  // ----------
  cpRestrictByCpsIds = "cpRestrictByCpsIds",
  restrictByIspService = "restrictByIspService",
  // ----------
  qnConfigurationDeploymentId = "qnConfigurationDeploymentId",
  // ----------
  forceHttp = "forceHttp",
  env = "env",
  freezeTime = "freezeTime",
  mock = "mock",
  debug = "debug",
  returnTo = "returnTo",
  cache = "cache",
  services = "services",
  recordSession = "recordSession",
  // ----------
  // limit the used networks/qns in media-analytics
  restrictQn = "restrictQn",
  restrictNetwork = "restrictNetwork",
  hideNetworkTitle = "hideNetworkTitle",
  mockSleepTime = "mockSleepTime",
  forcePretendNotQwiltUser = "forcePretendNotQwiltUser",

  ////////////////////////////////////////////////////
  // NOTE: DON'T ADD NEW ITEMS - See comment at top //
  ////////////////////////////////////////////////////
}
