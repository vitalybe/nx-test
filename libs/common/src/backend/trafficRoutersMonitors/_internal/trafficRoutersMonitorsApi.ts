import { getOriginForApi } from "common/backend/backendOrigin";
import { TrafficRoutersMonitorsApiMock } from "common/backend/trafficRoutersMonitors";
import {
  ServerDnsRouterApiType,
  ServerDnsRouterResultApiType,
  ServerHealthCollectorApiType,
  ServerHealthCollectorResultApiType,
  ServerHttpRouterApiType,
  ServerHttpRouterResultApiType,
  ServerMonitorApiType,
  ServerMonitorResultApiType,
  TrafficRoutersMonitorsApiResult,
  ServerBgpCollectorResultApiType,
  ServerHealthProviderResultApiType,
  ServerHealthProviderApiType,
} from "common/backend/trafficRoutersMonitors/_types/trafficRoutersMonitorsTypes";
import { MockWrapperProxy } from "common/backend/_utils/mockWrapperProxy/mockWrapperProxy";
import { UrlParams } from "common/backend/_utils/urlParams";
import { devToolsStore } from "common/components/devTools/_stores/devToolsStore";
import { Ajax, AjaxMetadata } from "common/utils/ajax";
import { combineUrl } from "common/utils/combineUrl";
import { loggerCreator } from "common/utils/logger";

const moduleLogger = loggerCreator(__filename);

const BACKEND_URL = combineUrl(getOriginForApi("traffic-routers-monitors"), `/api/`);

export class TrafficRoutersMonitorsApi {
  protected constructor() {}

  //region Deprecated - tempFlag_serversTabMoreConfigurations
  // NOTE: Delete when tempFlag_serversTabMoreConfigurations removed
  async listServers(cdnId: string): Promise<TrafficRoutersMonitorsApiResult> {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, "1/cdns/", cdnId, "/traffic-routers-monitors/servers", params);

    const data = await Ajax.getJson(path);
    return data as TrafficRoutersMonitorsApiResult;
  }

  // NOTE: Delete when tempFlag_serversTabMoreConfigurations removed
  async updateServer(cdnId: string, hostname: string, status: string) {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, "1/cdns/", cdnId, "/traffic-routers-monitors/servers", hostname, params);

    await Ajax.putJson(path, { status });
  }
  //endregion

  //region Config
  async updateConfig(config: object, mode: "routers" | "monitors", cdnName: string): Promise<void> {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, "1/cdns/", cdnName, "/traffic-routers-monitors/configuration/", mode, params);

    await Ajax.putJson(path, config);
  }

  async getConfig(mode: "routers" | "monitors", cdnName: string): Promise<object> {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, "1/cdns/", cdnName, "/traffic-routers-monitors/configuration/", mode, params);

    return (await Ajax.getJson(path)) as object;
  }
  //endregion

  //region Monitor
  async listServersMonitors(cdnId: string): Promise<ServerMonitorResultApiType> {
    const params = new UrlParams({ includePreconfigured: true }).stringified;
    const path = combineUrl(BACKEND_URL, "2/cdns/", cdnId, "/monitors", params);

    const data = await Ajax.getJson(path);
    return data as ServerMonitorResultApiType;
  }

  async updateServerMonitor(cdnId: string, hostname: string, server: ServerMonitorApiType): Promise<void> {
    const path = combineUrl(BACKEND_URL, "2/cdns/", cdnId, "/monitors", hostname);
    await Ajax.putJson(path, server);
  }
  //endregion

  //region DnsRouter
  async listServersDnsRouters(cdnId: string): Promise<ServerDnsRouterResultApiType> {
    const params = new UrlParams({ includePreconfigured: true }).stringified;
    const path = combineUrl(BACKEND_URL, "2/cdns/", cdnId, "/dns-routers", params);
    const data = await Ajax.getJson(path);
    return data as ServerDnsRouterResultApiType;
  }

  async updateServerDnsRouter(cdnId: string, hostname: string, server: ServerDnsRouterApiType): Promise<void> {
    const path = combineUrl(BACKEND_URL, "2/cdns/", cdnId, "/dns-routers", hostname);
    await Ajax.putJson(path, server);
  }
  //endregion

  //region HttpRouter
  async listServersHttpRouters(cdnId: string): Promise<ServerHttpRouterResultApiType> {
    const params = new UrlParams({ includePreconfigured: true }).stringified;
    const path = combineUrl(BACKEND_URL, "2/cdns/", cdnId, "/http-routers", params);

    const data = await Ajax.getJson(path);
    return data as ServerHttpRouterResultApiType;
  }

  async updateServerHttpRouter(cdnId: string, hostname: string, server: ServerHttpRouterApiType): Promise<void> {
    const path = combineUrl(BACKEND_URL, "2/cdns/", cdnId, "/http-routers", hostname);
    await Ajax.putJson(path, server);
  }
  //endregion

  //region Health Collector
  async listServersHealthCollectors(cdnId: string): Promise<ServerHealthCollectorResultApiType> {
    const params = new UrlParams({ includePreconfigured: true }).stringified;
    const path = combineUrl(BACKEND_URL, "2/cdns/", cdnId, "/health-collectors", params);

    const data = await Ajax.getJson(path);
    return data as ServerHealthCollectorResultApiType;
  }

  async updateServerHealthCollector(
    cdnId: string,
    hostname: string,
    server: ServerHealthCollectorApiType
  ): Promise<void> {
    const path = combineUrl(BACKEND_URL, "2/cdns/", cdnId, "/health-collectors", hostname);
    await Ajax.putJson(path, server);
  }
  //endregion

  //region Health Provider
  async listServersHealthProviders(cdnId: string): Promise<ServerHealthProviderResultApiType> {
    const params = new UrlParams({ includePreconfigured: true }).stringified;
    const path = combineUrl(BACKEND_URL, "2/cdns/", cdnId, "/health-providers", params);

    const data = await Ajax.getJson(path);
    return data as ServerHealthProviderResultApiType;
  }

  async updateServerHealthProvider(
    cdnId: string,
    hostname: string,
    server: ServerHealthProviderApiType
  ): Promise<void> {
    const path = combineUrl(BACKEND_URL, "2/cdns/", cdnId, "/health-providers", hostname);
    await Ajax.putJson(path, server);
  }
  //endregion

  //region BGP Collectors
  async listServersBgpCollectors(metadata: AjaxMetadata): Promise<ServerBgpCollectorResultApiType> {
    const params = new UrlParams({ includePreconfigured: true }).stringified;
    const path = combineUrl(BACKEND_URL, "2/bgp-collectors", params);

    const data = await Ajax.getJson(path, metadata);
    return data as ServerBgpCollectorResultApiType;
  }

  //endregion

  //region [[ Singleton ]]
  protected static _instance: TrafficRoutersMonitorsApi | undefined;
  static get instance(): TrafficRoutersMonitorsApi {
    if (!this._instance) {
      const realApi = new TrafficRoutersMonitorsApi();
      const mockApi = MockWrapperProxy.wrap(realApi, TrafficRoutersMonitorsApiMock.instance);
      const isReal = !devToolsStore.isMockMode;
      this._instance = isReal ? realApi : mockApi;
    }

    return this._instance;
  }
  //endregion
}
