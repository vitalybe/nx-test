import { loggerCreator } from "common/utils/logger";
import { AjaxMetadata } from "common/utils/ajax";
import { CdnsApi } from "common/backend/cdns";
import { CdnEntity } from "src/_domain/cdnEntity";
import { PrepareQueryResult } from "common/utils/reactQueryUtils/prepareQueryResult";

const moduleLogger = loggerCreator(__filename);

export class CdnsProvider {
  private constructor() {}

  prepareQuery(): PrepareQueryResult<CdnEntity[]> {
    return new PrepareQueryResult<CdnEntity[]>({
      name: "CdnsProvider.provide",
      provide: async () => {
        const cdnsResult = await CdnsApi.instance.cdnList(new AjaxMetadata());
        return cdnsResult.cdns.map(
          (cdnApi) =>
            new CdnEntity({
              id: cdnApi.cdnId,
              name: cdnApi.name,
              description: cdnApi.description ?? "",
              httpCdnSubDomain: cdnApi.httpCdnSubDomain,
              httpSubDomain: cdnApi.httpSubDomain,
              httpRootHostedZone: cdnApi.httpRootHostedZone,
              operationalDomain: cdnApi.operationalDomain ?? "",
              dnsSubDomain: cdnApi.dnsSubDomain,
              dnsRootHostedZone: cdnApi.dnsRootHostedZone,
              dnsCdnSubDomain: cdnApi.dnsCdnSubDomain,
            })
        );
      },
    });
  }

  //region [[ Singleton ]]
  private static _instance: CdnsProvider | undefined;
  static get instance(): CdnsProvider {
    if (!this._instance) {
      this._instance = new CdnsProvider();
    }

    return this._instance;
  }
  //endregion
}
