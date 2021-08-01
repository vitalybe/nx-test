import { TrafficRoutersMonitorsApi } from "common/backend/trafficRoutersMonitors";
import { loggerCreator } from "common/utils/logger";
import { HealthCollectorEntity } from "src/selectedCdn/tabs/tabMonitorsAndRouters/subTabs/healthCollectorsTab/_domain/healthCollectorEntity";
import { HealthCollectorFormType } from "src/selectedCdn/tabs/tabMonitorsAndRouters/subTabs/healthCollectorsTab/_domain/healthCollectorFormType";
import { MonitorsAndRoutersProviderUtils } from "src/selectedCdn/tabs/tabMonitorsAndRouters/subTabs/_utils/monitorsAndRoutersProviderUtils";
import { PrepareQueryResult } from "common/utils/reactQueryUtils/prepareQueryResult";

// noinspection JSUnusedLocalSymbols
const moduleLogger = loggerCreator(__filename);

export class HealthCollectorsProvider {
  private constructor() {}

  prepareQuery(cdnName: string): PrepareQueryResult<HealthCollectorEntity[]> {
    return new PrepareQueryResult<HealthCollectorEntity[]>({
      name: "HealthCollectorsProvider.prepareQuery",
      // NOTE: remove if there are no arguments
      // eslint-disable-next-line prefer-rest-params
      params: [...arguments],
      provide: async () => {
        return await this.provide(cdnName);
      },
    });
  }

  provide = async (cdnName: string): Promise<HealthCollectorEntity[]> => {
    const result = await TrafficRoutersMonitorsApi.instance.listServersHealthCollectors(cdnName);

    return result.healthCollectors.map((item) => {
      return {
        ...MonitorsAndRoutersProviderUtils.toServerEntity(item),
        healthCollectorRegion: item.healthCollectorRegion,
        status: item.status,
      };
    });
  };

  update = async (cdnName: string, hostName: string, formData: HealthCollectorFormType): Promise<void> => {
    await TrafficRoutersMonitorsApi.instance.updateServerHealthCollector(cdnName, hostName, {
      groupServerDsRemapConfigEnabled: true,
      status: formData.status,
      healthCollectorRegion: formData.healthCollectorRegion,
    });
    this.prepareQuery(cdnName).invalidateWithChildren();
  };

  //region [[ Singleton ]]
  private static _instance: HealthCollectorsProvider | undefined;
  static get instance(): HealthCollectorsProvider {
    if (!this._instance) {
      this._instance = new HealthCollectorsProvider();
    }

    return this._instance;
  }
  //endregion
}
