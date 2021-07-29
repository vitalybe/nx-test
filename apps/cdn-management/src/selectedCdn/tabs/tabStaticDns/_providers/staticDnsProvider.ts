import { loggerCreator } from "common/utils/logger";
import { PrepareQueryResult } from "common/utils/reactQueryUtils/prepareQueryResult";
import { StaticDnsEntity } from "src/selectedCdn/tabs/tabStaticDns/_domain/staticDnsEntity";
import { StaticDnsApi } from "common/backend/staticDns";
import { StaticDnsFormData } from "src/selectedCdn/tabs/tabStaticDns/editorStaticDns/EditorStaticDns";
import { StaticDnsEditApiType } from "common/backend/staticDns/_types/staticDnsTypes";

// noinspection JSUnusedLocalSymbols
const moduleLogger = loggerCreator(__filename);

export class StaticDnsProvider {
  private constructor() {}

  prepareQuery(): PrepareQueryResult<StaticDnsEntity[]> {
    return new PrepareQueryResult<StaticDnsEntity[]>({
      name: "StaticDnsProvider.prepareQuery",
      provide: async () => {
        const data = (await StaticDnsApi.instance.list()) as {
          staticDnsResponseList: StaticDnsEntity[];
        };
        return data.staticDnsResponseList;
      },
    });
  }

  async delete(staticDns: StaticDnsEntity) {
    await StaticDnsApi.instance.delete(staticDns.dnsRecordId);
    this.prepareQuery().invalidateWithChildren();
  }

  async update(mode: "add" | "edit", data: StaticDnsFormData) {
    if (mode === "add") {
      await StaticDnsApi.instance.create(data as StaticDnsEditApiType);
    } else {
      await StaticDnsApi.instance.update(data.dnsRecordId, data as StaticDnsEditApiType);
    }
    this.prepareQuery().invalidateWithChildren();
  }

  //region [[ Singleton ]]
  private static _instance: StaticDnsProvider | undefined;
  static get instance(): StaticDnsProvider {
    if (!this._instance) {
      this._instance = new StaticDnsProvider();
    }

    return this._instance;
  }
  //endregion
}
