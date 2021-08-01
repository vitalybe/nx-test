import { loggerCreator } from "../utils/logger";
import { AjaxMetadata } from "../utils/ajax";
import { OrgEntity } from "common/domain/orgEntity";
import { AuthDataApi } from "../backend/authData";
import { PrepareQueryResult } from "common/utils/reactQueryUtils/prepareQueryResult";

const moduleLogger = loggerCreator(__filename);

export type OrgMap = Record<string, OrgEntity>;

export class OrganizationsProvider {
  private constructor() {}

  prepareQuery(): PrepareQueryResult<OrgMap> {
    return new PrepareQueryResult<OrgMap>({
      name: "OrganizationsProvider.prepareQuery",
      provide: async () => {
        return await this.provide(new AjaxMetadata());
      },
    });
  }

  provide = async (metadata: AjaxMetadata): Promise<OrgMap> => {
    const map: OrgMap = {};
    const { organizations } = await AuthDataApi.instance.allowedOrganizations(metadata);
    organizations.forEach((org) => {
      map[org.id] = new OrgEntity({
        id: org.id,
        name: org.name ?? org.id,
      });
    });

    return map;
  };

  //region [[ Singleton ]]
  private static _instance: OrganizationsProvider | undefined;
  static get instance(): OrganizationsProvider {
    if (!this._instance) {
      this._instance = new OrganizationsProvider();
    }

    return this._instance;
  }
  //endregion
}
