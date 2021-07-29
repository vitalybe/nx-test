import { loggerCreator } from "common/utils/logger";
import { AjaxMetadata } from "common/utils/ajax";
import {
  ServerApiTypeV2,
  ServerStatus,
  ServerType,
} from "common/backend/trafficRoutersMonitors/_types/trafficRoutersMonitorsTypes";
import { GenericServerEntity } from "src/selectedCdn/tabs/tabMonitorsAndRouters/_domain/server/genericServerEntity";
import { TrafficRoutersMonitorsApi } from "common/backend/trafficRoutersMonitors";
import { PrepareQueryResult } from "common/utils/reactQueryUtils/prepareQueryResult";

const moduleLogger = loggerCreator(__filename);

type ServerWithStatus = ServerApiTypeV2 & { status: ServerStatus };

export class ServersProvider {
  private constructor() {}

  prepareQuery(cdnId: string): PrepareQueryResult<GenericServerEntity[]> {
    return new PrepareQueryResult<GenericServerEntity[]>({
      name: "ServersProvider.prepareQuery",
      // NOTE: remove if there are no arguments
      // eslint-disable-next-line prefer-rest-params
      params: [...arguments],
      provide: async () => {
        return await this.provide(cdnId, new AjaxMetadata());
      },
    });
  }

  async provide(cdnId: string, metadata: AjaxMetadata, type?: ServerType): Promise<GenericServerEntity[]> {
    return [
      ...(await this.getServerForType(
        ServerType.MONITOR,
        type,
        async () => (await TrafficRoutersMonitorsApi.instance.listServersMonitors(cdnId)).monitors
      )),
      ...(await this.getServerForType(
        ServerType.DNS_ROUTER,
        type,
        async () => (await TrafficRoutersMonitorsApi.instance.listServersDnsRouters(cdnId)).dnsRouters
      )),
      ...(await this.getServerForType(
        ServerType.HTTP_ROUTER,
        type,
        async () => (await TrafficRoutersMonitorsApi.instance.listServersHttpRouters(cdnId)).httpRouters
      )),
      ...(await this.getServerForType(
        ServerType.HEALTH_COLLECTOR,
        type,
        async () => (await TrafficRoutersMonitorsApi.instance.listServersHealthCollectors(cdnId)).healthCollectors
      )),
    ];
  }

  private async getServerForType(
    type: ServerType,
    restrictedType: ServerType | undefined,
    getServersCallback: () => Promise<ServerWithStatus[]>
  ): Promise<GenericServerEntity[]> {
    let results: GenericServerEntity[] = [];
    if (!restrictedType || type === restrictedType) {
      const serversResult = await getServersCallback();

      results = serversResult.map(
        (server: ServerWithStatus) =>
          new GenericServerEntity({
            hostname: server.hostname,
            systemId: server.systemId,
            domain: server.domain,
            ipv4Address: server.ipv4Address ?? "",
            ipv6Address: server.ipv6Address ?? "",
            tcpPort: server.tcpPort,
            httpsPort: server.httpsPort,
            status: server.status,
            type: type,
            groupServerDsRemapConfigEnabled: true,
            healthCollectorRegion: "N/A",
            segmentId: "N/A",
            groupName: "N/A",
          })
      );
    }

    return results;
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
