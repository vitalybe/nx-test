import { TrafficRoutersMonitorsApi } from "@qwilt/common/backend/trafficRoutersMonitors";
import { loggerCreator } from "@qwilt/common/utils/logger";
import { DnsRouterEntity } from "../_domain/dnsRouterEntity";
import { DnsRouterFormType } from "../_domain/dnsRouterFormType";
import { MonitorsAndRoutersProviderUtils } from "../../_utils/monitorsAndRoutersProviderUtils";
import { PrepareQueryResult } from "@qwilt/common/utils/reactQueryUtils/prepareQueryResult";

// noinspection JSUnusedLocalSymbols
const moduleLogger = loggerCreator("__filename");

export class DnsRoutersProvider {
  private constructor() {}

  prepareQuery(cdnName: string): PrepareQueryResult<DnsRouterEntity[]> {
    return new PrepareQueryResult<DnsRouterEntity[]>({
      name: "DnsRoutersProvider.prepareQuery",
      // NOTE: remove if there are no arguments
      // eslint-disable-next-line prefer-rest-params
      params: [...arguments],
      provide: async () => {
        return await this.provide(cdnName);
      },
    });
  }

  provide = async (cdnName: string): Promise<DnsRouterEntity[]> => {
    const result = await TrafficRoutersMonitorsApi.instance.listServersDnsRouters(cdnName);

    return result.dnsRouters.map((item) => {
      return {
        ...MonitorsAndRoutersProviderUtils.toServerEntity(item),
        dnsRoutingSegmentId: item.dnsRoutingSegmentId,
        healthProviders: MonitorsAndRoutersProviderUtils.toHealthProviderEntities(item.healthProviders ?? []),
        status: item.status,
      };
    });
  };

  update = async (cdnName: string, hostName: string, formData: DnsRouterFormType): Promise<void> => {
    await TrafficRoutersMonitorsApi.instance.updateServerDnsRouter(cdnName, hostName, {
      dnsRoutingSegmentId: formData.dnsRoutingSegmentId,
      groupServerDsRemapConfigEnabled: true,
      healthProviders: MonitorsAndRoutersProviderUtils.toHealthProviderApiEntity(formData.healthProviders),
      status: formData.status,
    });
  };

  //region [[ Singleton ]]
  private static _instance: DnsRoutersProvider | undefined;
  static get instance(): DnsRoutersProvider {
    if (!this._instance) {
      this._instance = new DnsRoutersProvider();
    }

    return this._instance;
  }
  //endregion
}
