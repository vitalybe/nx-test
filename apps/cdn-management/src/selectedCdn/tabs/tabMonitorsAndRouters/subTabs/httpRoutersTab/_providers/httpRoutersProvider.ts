import { TrafficRoutersMonitorsApi } from "common/backend/trafficRoutersMonitors";
import { loggerCreator } from "common/utils/logger";
import { HttpRouterEntity } from "src/selectedCdn/tabs/tabMonitorsAndRouters/subTabs/httpRoutersTab/_domain/httpRouterEntity";
import { HttpRouterFormType } from "src/selectedCdn/tabs/tabMonitorsAndRouters/subTabs/httpRoutersTab/_domain/httpRouterFormType";
import { MonitorsAndRoutersProviderUtils } from "src/selectedCdn/tabs/tabMonitorsAndRouters/subTabs/_utils/monitorsAndRoutersProviderUtils";
import { PrepareQueryResult } from "common/utils/reactQueryUtils/prepareQueryResult";

// noinspection JSUnusedLocalSymbols
const moduleLogger = loggerCreator(__filename);

export class HttpRoutersProvider {
  private constructor() {}

  prepareQuery(cdnName: string): PrepareQueryResult<HttpRouterEntity[]> {
    return new PrepareQueryResult<HttpRouterEntity[]>({
      name: "HttpRoutersProvider.prepareQuery",
      // NOTE: remove if there are no arguments
      // eslint-disable-next-line prefer-rest-params
      params: [...arguments],
      provide: async () => {
        return await this.provide(cdnName);
      },
    });
  }

  provide = async (cdnName: string): Promise<HttpRouterEntity[]> => {
    const result = await TrafficRoutersMonitorsApi.instance.listServersHttpRouters(cdnName);

    return result.httpRouters.map((item) => {
      return {
        ...MonitorsAndRoutersProviderUtils.toServerEntity(item),
        httpRouterGroupName: item.httpRouterGroupName,
        healthProviders: MonitorsAndRoutersProviderUtils.toHealthProviderEntities(item.healthProviders),
        status: item.status,
      };
    });
  };

  update = async (cdnName: string, hostName: string, formData: HttpRouterFormType): Promise<void> => {
    await TrafficRoutersMonitorsApi.instance.updateServerHttpRouter(cdnName, hostName, {
      httpRouterGroupName: formData.httpRouterGroupName ?? "",
      groupServerDsRemapConfigEnabled: true,
      healthProviders: MonitorsAndRoutersProviderUtils.toHealthProviderApiEntity(formData.healthProviders),
      status: formData.status,
    });
    this.prepareQuery(cdnName).invalidateWithChildren();
  };

  //region [[ Singleton ]]
  private static _instance: HttpRoutersProvider | undefined;
  static get instance(): HttpRoutersProvider {
    if (!this._instance) {
      this._instance = new HttpRoutersProvider();
    }

    return this._instance;
  }
  //endregion
}
