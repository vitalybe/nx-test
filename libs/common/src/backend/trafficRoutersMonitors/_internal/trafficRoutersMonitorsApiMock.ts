/* eslint-disable */
import { TrafficRoutersMonitorsApi } from "../../trafficRoutersMonitors";
import {
  ServerApiType,
  ServerBgpCollectorResultApiType,
  ServerDnsRouterResultApiType,
  ServerHealthCollectorResultApiType,
  ServerHealthProviderApiType,
  ServerHealthProviderResultApiType,
  ServerHttpRouterResultApiType,
  ServerMonitorResultApiType,
  ServerStatus,
  ServerType,
  TrafficRoutersMonitorsApiResult,
} from "../_types/trafficRoutersMonitorsTypes";
import { loggerCreator } from "../../../utils/logger";
import { mockNetworkSleep } from "../../../utils/mockUtils";
import { sleep } from "../../../utils/sleep";
import { AjaxMetadata } from "../../../utils/ajax";

const moduleLogger = loggerCreator("__filename");

export class TrafficRoutersMonitorsApiMock implements TrafficRoutersMonitorsApi {
  //region Deprecated - tempFlag_serversTabMoreConfigurations
  async listServers(): Promise<TrafficRoutersMonitorsApiResult> {
    await sleep(mockNetworkSleep);

    const servers: Record<string, ServerApiType> = {};

    servers["0"] = {
      domain: "qwilt",
      hostname: "tc-dng1.cqloud.com",
      httpsPort: "aws-0-router.tc-dng",
      ipv4Address: "router-0",
      ipv6Address: "router-1",
      status: "online",
      systemId: "efefefe",
      tcpPort: "80",
      links: [],
      segmentId: "segmentID0",
      httpRouterGroupName: "groupID0",
      groupServerDsRemapConfigEnabled: false,
      type: ServerType.DNS_ROUTER,
    };

    servers["1"] = {
      domain: "qwilt",
      hostname: "tc-dng1.cqloud.com",
      httpsPort: "aws-0-router.tc-dng",
      ipv4Address: "router-0",
      ipv6Address: "router-1",
      status: "online",
      systemId: "efefefe",
      tcpPort: "80",
      links: [],
      segmentId: "segmentID1",
      httpRouterGroupName: "groupID1",
      groupServerDsRemapConfigEnabled: undefined,
      type: ServerType.DNS_ROUTER,
    };

    servers["2"] = {
      domain: "qwilt",
      hostname: "tc-dng1.cqloud.com",
      httpsPort: "aws-0-router.tc-dng",
      ipv4Address: "router-0",
      ipv6Address: "router-1",
      status: "online",
      systemId: "efefefe",
      tcpPort: "80",
      links: [],
      segmentId: "segmentID2",
      httpRouterGroupName: "groupID2",
      type: ServerType.DNS_ROUTER,
      groupServerDsRemapConfigEnabled: true,
    };

    servers["3"] = {
      domain: "qwilt",
      hostname: "tc-dng1.cqloud.com",
      httpsPort: "aws-0-router.tc-dng",
      ipv4Address: "router-0",
      ipv6Address: "router-1",
      status: "online",
      systemId: "efefefe",
      tcpPort: "80",
      links: [],
      segmentId: "segmentID3",
      httpRouterGroupName: "groupID3",
      type: ServerType.MONITOR,
    };

    servers["4"] = {
      domain: "qwilt",
      hostname: "tc-dng1.cqloud.com",
      httpsPort: "aws-0-router.tc-dng",
      ipv4Address: "router-0",
      ipv6Address: "router-1",
      status: "online",
      systemId: "efefefe",
      tcpPort: "80",
      links: [],
      segmentId: "segmentID4",
      httpRouterGroupName: "groupID4",
      type: ServerType.MONITOR,
    };

    servers["5"] = {
      domain: "qwilt",
      hostname: "tc-dng1.cqloud.com",
      httpsPort: "aws-0-router.tc-dng",
      ipv4Address: "router-0",
      ipv6Address: "router-1",
      status: "online",
      systemId: "efefefe",
      tcpPort: "80",
      links: [],
      segmentId: "segmentID5",
      httpRouterGroupName: "groupID5",
      type: ServerType.HTTP_ROUTER,
      groupServerDsRemapConfigEnabled: false,
    };

    servers["6"] = {
      domain: "qwilt",
      hostname: "tc-dng1.cqloud.com",
      httpsPort: "aws-0-router.tc-dng",
      ipv4Address: "router-0",
      ipv6Address: "router-1",
      status: "online",
      systemId: "efefefe",
      tcpPort: "80",
      links: [],
      segmentId: "segmentID6",
      httpRouterGroupName: "groupID6",
      type: ServerType.HTTP_ROUTER,
    };

    servers["7"] = {
      domain: "qwilt",
      hostname: "tc-dng1.cqloud.com",
      httpsPort: "aws-0-router.tc-dng",
      ipv4Address: "router-0",
      ipv6Address: "router-1",
      status: "online",
      systemId: "manifestRouter1",
      tcpPort: "80",
      links: [],
      segmentId: "segmentID7",
      httpRouterGroupName: "groupID7",
      type: ServerType.HTTP_ROUTER,
    };

    servers["8"] = {
      domain: "qwilt",
      hostname: "tc-dng1.cqloud.com",
      httpsPort: "aws-0-router.tc-dng",
      ipv4Address: "router-0",
      ipv6Address: "router-1",
      status: "online",
      systemId: "manifestRouter2",
      tcpPort: "80",
      links: [],
      segmentId: "segmentID8",
      httpRouterGroupName: "groupID8",
      type: ServerType.HTTP_ROUTER,
    };

    servers["9"] = {
      domain: "qwilt",
      hostname: "tc-dng1.cqloud.com",
      httpsPort: "aws-0-router.tc-dng",
      ipv4Address: "router-1",
      ipv6Address: "router-2",
      status: "online",
      systemId: "healthCollector2",
      tcpPort: "80",
      links: [],
      segmentId: "segmentID8",
      httpRouterGroupName: "groupID8",
      healthCollectorRegion: "usa",
      type: ServerType.HEALTH_COLLECTOR,
    };

    servers["10"] = {
      domain: "qwilt",
      hostname: "tc-dng4.cqloud.com",
      httpsPort: "aws-3-router.tc-dng",
      ipv4Address: "router-4",
      ipv6Address: "router-5",
      status: "online",
      systemId: "healthCollector3",
      tcpPort: "80",
      links: [],
      segmentId: "segmentID8",
      httpRouterGroupName: "groupID8",
      type: ServerType.HEALTH_COLLECTOR,
    };

    return {
      servers: Object.values(servers),
    };
  }

  async updateServer(cdnName: string, hostname: string, status: string) {
    await sleep(mockNetworkSleep);
    moduleLogger.debug("Mock update, id: " + hostname);
    moduleLogger.debug(JSON.stringify(status));
  }
  //endregion

  //region Config
  async updateConfig(config: object, mode: "routers" | "monitors", cdnName: string): Promise<void> {
    await sleep(mockNetworkSleep);
  }

  async getConfig(mode: "routers" | "monitors", cdnName: string): Promise<object> {
    await sleep(mockNetworkSleep);
    return { a: "test", b: "stuff" };
  }
  //endregion

  //region Monitor
  async listServersMonitors(): Promise<ServerMonitorResultApiType> {
    return {
      monitors: [
        {
          domain: "qwilt",
          hostname: "tc-dng1.cqloud.com",
          ipv4Address: "router-0",
          ipv6Address: "router-1",
          systemId: "efefefe",
          tcpPort: 80,
          httpsPort: 686,

          segmentId: "segmentID0",
          status: ServerStatus.ONLINE,
          groupServerDsRemapConfigEnabled: true,
        },
        {
          domain: "qwilt",
          hostname: "tc-dng1.cqloud.com",
          ipv4Address: "router-0",
          ipv6Address: "router-1",
          systemId: "efefefe",
          tcpPort: 80,
          httpsPort: 686,

          segmentId: "segmentID0",
          status: ServerStatus.ONLINE,
          groupServerDsRemapConfigEnabled: true,
        },
        {
          domain: "qwilt",
          hostname: "tc-dng1.cqloud.com",
          ipv4Address: "router-0",
          ipv6Address: "router-1",
          systemId: "efefefe",
          tcpPort: 80,
          httpsPort: 686,

          segmentId: "segmentID0",
          status: ServerStatus.ONLINE,
          groupServerDsRemapConfigEnabled: true,
        },
      ],
    };
  }

  async updateServerMonitor(): Promise<void> {
    await sleep(mockNetworkSleep);
  }
  //endregion

  //region DnsRouter
  async listServersDnsRouters(): Promise<ServerDnsRouterResultApiType> {
    return {
      dnsRouters: [
        {
          domain: "qwilt",
          hostname: "tc-dng1.cqloud.com",
          ipv4Address: "router-0",
          ipv6Address: "router-1",
          systemId: "efefefe",
          tcpPort: 80,
          httpsPort: 686,
          groupServerDsRemapConfigEnabled: true,

          dnsRoutingSegmentId: "fdgfdg",
          healthProviders: [
            { name: "health1", priority: 1 },
            { name: "health2", priority: 2 },
          ],
          status: ServerStatus.ONLINE,
        },
        {
          domain: "qwilt",
          hostname: "tc-dng1.cqloud.com",
          ipv4Address: "router-0",
          ipv6Address: "router-1",
          systemId: "efefefe",
          tcpPort: 80,
          httpsPort: 686,
          groupServerDsRemapConfigEnabled: true,

          dnsRoutingSegmentId: "fdgfdg",
          healthProviders: [
            { name: "health1", priority: 1 },
            { name: "health2", priority: 2 },
          ],
          status: ServerStatus.ONLINE,
        },
        {
          domain: "qwilt",
          hostname: "tc-dng1.cqloud.com",
          ipv4Address: "router-0",
          ipv6Address: "router-1",
          systemId: "efefefe",
          tcpPort: 80,
          httpsPort: 686,
          groupServerDsRemapConfigEnabled: true,

          dnsRoutingSegmentId: "fdgfdg",
          healthProviders: [
            { name: "health1", priority: 1 },
            { name: "health2", priority: 2 },
          ],
          status: ServerStatus.ONLINE,
        },
      ],
    };
  }

  async updateServerDnsRouter(): Promise<void> {}
  //endregion

  //region HttpRouter
  async listServersHttpRouters(): Promise<ServerHttpRouterResultApiType> {
    return {
      httpRouters: [
        {
          domain: "qwilt",
          hostname: "tc-dng1.cqloud.com",
          ipv4Address: "router-0",
          ipv6Address: "router-1",
          systemId: "efefefe",
          tcpPort: 80,
          httpsPort: 686,
          groupServerDsRemapConfigEnabled: true,

          httpRouterGroupName: "fefefeef",
          healthProviders: [
            { name: "health1", priority: 1 },
            { name: "health2", priority: 2 },
          ],
          status: ServerStatus.ONLINE,
        },
      ],
    };
  }

  async updateServerHttpRouter(): Promise<void> {}
  //endregion

  //region Health Collector
  async listServersHealthCollectors(): Promise<ServerHealthCollectorResultApiType> {
    return {
      healthCollectors: [
        {
          domain: "qwilt",
          hostname: "tc-dng1.cqloud.com",
          ipv4Address: "router-0",
          ipv6Address: "router-1",
          systemId: "efefefe",
          tcpPort: 80,
          httpsPort: 686,
          groupServerDsRemapConfigEnabled: true,

          healthCollectorRegion: "jdjdje",
          status: ServerStatus.ONLINE,
        },
      ],
    };
  }

  async updateServerHealthCollector(): Promise<void> {}
  //endregion

  //region Health Provider
  async listServersHealthProviders(cdnId: string): Promise<ServerHealthProviderResultApiType> {
    return {
      healthProviders: [
        {
          domain: "qwilt",
          hostname: "tc-dng1.cqloud.com",
          ipv4Address: "router-0",
          ipv6Address: "router-1",
          systemId: "efefefe",
          tcpPort: 80,
          httpsPort: 686,

          status: ServerStatus.ONLINE,
        },
      ],
    };
  }

  async updateServerHealthProvider(
    cdnId: string,
    hostname: string,
    server: ServerHealthProviderApiType
  ): Promise<void> {}
  //endregion

  //region BGP Collectors
  async listServersBgpCollectors(metadata: AjaxMetadata): Promise<ServerBgpCollectorResultApiType> {
    return {
      bgpCollectors: [
        {
          domain: "qwilt",
          hostname: "bgp-dng1.cqloud.com",
          ipv4Address: "bgp-0",
          ipv6Address: "bgp-1",
          systemId: "efefefe",
          tcpPort: 80,
          httpsPort: 686,
        },
      ],
    };
  }

  //endregion

  //region [[ Singleton ]]
  protected static _instance: TrafficRoutersMonitorsApiMock | undefined;
  static get instance(): TrafficRoutersMonitorsApiMock {
    if (!this._instance) {
      this._instance = new TrafficRoutersMonitorsApiMock();
    }

    return this._instance;
  }
  //endregion
}
