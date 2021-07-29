import { TrafficRoutersMonitorsApi } from "@qwilt/common/backend/trafficRoutersMonitors";
import { loggerCreator } from "@qwilt/common/utils/logger";
import { HealthProviderEntity } from "../_domain/healthProviderEntity";
import { HealthProviderFormType } from "../_domain/healthProviderFormType";
import { MonitorsAndRoutersProviderUtils } from "../../_utils/monitorsAndRoutersProviderUtils";
import { PrepareQueryResult } from "@qwilt/common/utils/reactQueryUtils/prepareQueryResult";

// noinspection JSUnusedLocalSymbols
const moduleLogger = loggerCreator("__filename");

export class HealthProvidersProvider {
  private constructor() {}

  prepareQuery(cdnName: string): PrepareQueryResult<HealthProviderEntity[]> {
    return new PrepareQueryResult<HealthProviderEntity[]>({
      name: "HealthProvidersProvider.prepareQuery",
      // NOTE: remove if there are no arguments
      // eslint-disable-next-line prefer-rest-params
      params: [...arguments],
      provide: async () => {
        return await this.provide(cdnName);
      },
    });
  }

  provide = async (cdnName: string): Promise<HealthProviderEntity[]> => {
    const result = await TrafficRoutersMonitorsApi.instance.listServersHealthProviders(cdnName);

    return result.healthProviders.map((item) => {
      return {
        ...MonitorsAndRoutersProviderUtils.toServerEntity(item),
        status: item.status,
      };
    });
  };

  update = async (cdnName: string, hostName: string, formData: HealthProviderFormType): Promise<void> => {
    await TrafficRoutersMonitorsApi.instance.updateServerHealthProvider(cdnName, hostName, {
      status: formData.status,
    });
    this.prepareQuery(cdnName).invalidateWithChildren();
  };

  //region [[ Singleton ]]
  private static _instance: HealthProvidersProvider | undefined;
  static get instance(): HealthProvidersProvider {
    if (!this._instance) {
      this._instance = new HealthProvidersProvider();
    }

    return this._instance;
  }
  //endregion
}
