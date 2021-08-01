import { loggerCreator } from "common/utils/logger";
import { TrafficRoutersMonitorsApi } from "common/backend/trafficRoutersMonitors";

import { GenericServerEntity } from "src/selectedCdn/tabs/tabMonitorsAndRouters/_domain/server/genericServerEntity";
import { ServerStatus } from "common/backend/trafficRoutersMonitors/_types/trafficRoutersMonitorsTypes";

const moduleLogger = loggerCreator(__filename);

export class ServersProvider {
  async provide(cdnName: string): Promise<GenericServerEntity[]> {
    const data = await TrafficRoutersMonitorsApi.instance.listServers(cdnName);
    return data.servers.map((server) => {
      return new GenericServerEntity({
        domain: server.domain,
        hostname: server.hostname,
        httpsPort: parseInt(server.httpsPort),
        ipv4Address: server.ipv4Address,
        ipv6Address: server.ipv6Address,
        status: server.status as ServerStatus,
        systemId: server.systemId,
        tcpPort: parseInt(server.tcpPort),
        type: server.type,
        groupServerDsRemapConfigEnabled: !!server.groupServerDsRemapConfigEnabled,
        segmentId: server.segmentId,
        groupName: server.httpRouterGroupName,
        healthCollectorRegion: server.healthCollectorRegion ?? "",
      });
    });
  }

  //region [[ Singleton ]]
  private static _instance: ServersProvider | undefined;
  static get instance(): ServersProvider {
    if (!this._instance) {
      this._instance = new ServersProvider();
    }

    return this._instance;
  }
  //endregion
}
