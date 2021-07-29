import { TrafficRoutersMonitorsApi } from "common/backend/trafficRoutersMonitors";
import { loggerCreator } from "common/utils/logger";
import { MonitorEntity } from "src/selectedCdn/tabs/tabMonitorsAndRouters/subTabs/monitorsTab/_domain/monitorEntity";
import { MonitorFormType } from "src/selectedCdn/tabs/tabMonitorsAndRouters/subTabs/monitorsTab/_domain/monitorFormType";
import { MonitorsAndRoutersProviderUtils } from "src/selectedCdn/tabs/tabMonitorsAndRouters/subTabs/_utils/monitorsAndRoutersProviderUtils";
import { PrepareQueryResult } from "common/utils/reactQueryUtils/prepareQueryResult";

// noinspection JSUnusedLocalSymbols
const moduleLogger = loggerCreator(__filename);

export class MonitorsProvider {
  private constructor() {}

  prepareQuery(cdnName: string): PrepareQueryResult<MonitorEntity[]> {
    return new PrepareQueryResult<MonitorEntity[]>({
      name: "MonitorsProvider.prepareQuery",
      // NOTE: remove if there are no arguments
      // eslint-disable-next-line prefer-rest-params
      params: [...arguments],
      provide: async () => {
        return await this.provide(cdnName);
      },
    });
  }

  provide = async (cdnName: string): Promise<MonitorEntity[]> => {
    const result = await TrafficRoutersMonitorsApi.instance.listServersMonitors(cdnName);

    return result.monitors.map((item) => {
      return {
        ...MonitorsAndRoutersProviderUtils.toServerEntity(item),
        segmentId: item.segmentId,
        status: item.status,
      };
    });
  };

  update = async (cdnName: string, hostName: string, formData: MonitorFormType): Promise<void> => {
    await TrafficRoutersMonitorsApi.instance.updateServerMonitor(cdnName, hostName, {
      segmentId: formData.segmentId,
      status: formData.status,
      groupServerDsRemapConfigEnabled: true,
    });
    this.prepareQuery(cdnName).invalidateWithChildren();
  };

  //region [[ Singleton ]]
  private static _instance: MonitorsProvider | undefined;
  static get instance(): MonitorsProvider {
    if (!this._instance) {
      this._instance = new MonitorsProvider();
    }

    return this._instance;
  }
  //endregion
}
