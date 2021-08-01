import { loggerCreator } from "@qwilt/common/utils/logger";
import { AjaxMetadata } from "@qwilt/common/utils/ajax";
import { HttpRouterGroupEntity } from "../_domain/httpRouterGroupEntity";
import { HttpRouterGroupType } from "@qwilt/common/backend/cdns/_types/httpRouterGroupType";
import { HttpRouterGroupsFormData } from "../_domain/httpRouterGroupsFormData";
import { CdnsApi } from "@qwilt/common/backend/cdns";
import { PrepareQueryResult } from "@qwilt/common/utils/reactQueryUtils/prepareQueryResult";

const moduleLogger = loggerCreator("__filename");

export class HttpRouterGroupsProvider {
  private constructor() {}

  prepareQuery(cdnId: string): PrepareQueryResult<HttpRouterGroupEntity[]> {
    return new PrepareQueryResult<HttpRouterGroupEntity[]>({
      name: "HttpRouterGroupsProvider.prepareQuery",
      // NOTE: remove if there are no arguments
      // eslint-disable-next-line prefer-rest-params
      params: [...arguments],
      provide: async () => {
        return await this.provide(cdnId);
      },
    });
  }

  provide = async (cdnId: string, metadata: AjaxMetadata = new AjaxMetadata()): Promise<HttpRouterGroupEntity[]> => {
    const data = await CdnsApi.instance.httpRouterGroupsList(cdnId, metadata);

    //initializing a map of {groupId: group}
    const groupsMap = new Map<string, HttpRouterGroupEntity>();

    //initializing a set of {groupId}
    const fallbackGroupsIdsSet = new Set<string>();

    //set ids of Fallback Groups into Set
    data.httpRouterGroups.forEach((group) => {
      group.fallbackGroups.forEach((fallbackGroupId) => {
        if (!fallbackGroupsIdsSet.has(fallbackGroupId)) {
          fallbackGroupsIdsSet.add(fallbackGroupId);
        }
      });

      //set HTTP Router Groups into Map
      groupsMap.set(group.httpRouterGroupId, {
        id: group.httpRouterGroupId,
        name: group.httpRouterGroupName,
        cdnId: group.cdnId,
        ttl: group.ttl,
        dnsName: group.dnsName,
        fallbackGroups: [],
        isDeletable: true,
      });
    });

    //returns entities using groupMap
    return data.httpRouterGroups.map((group) => {
      return {
        ...groupsMap.get(group.httpRouterGroupId),
        fallbackGroups: group.fallbackGroups.map((fallbackGroup) => groupsMap.get(fallbackGroup)),
        isDeletable: !fallbackGroupsIdsSet.has(group.httpRouterGroupId),
      };
    }) as HttpRouterGroupEntity[];
  };

  create = async (cdnId: string, entity: HttpRouterGroupsFormData) => {
    await CdnsApi.instance.httpRouterGroupsCreate(cdnId, this.toApiEntity(entity));
    this.prepareQuery(cdnId).invalidateWithChildren();
  };

  update = async (cdnId: string, id: string, entity: HttpRouterGroupsFormData) => {
    await CdnsApi.instance.httpRouterGroupsUpdate(cdnId, id, this.toApiEntity(entity));
    this.prepareQuery(cdnId).invalidateWithChildren();
  };

  delete = async (cdnId: string, id: string) => {
    await CdnsApi.instance.httpRouterGroupsDelete(cdnId, id);
    this.prepareQuery(cdnId).invalidateWithChildren();
  };

  toApiEntity = (httpRouterGroupEntity: HttpRouterGroupsFormData): HttpRouterGroupType => {
    return {
      httpRouterGroupName: httpRouterGroupEntity.name,
      ttl: httpRouterGroupEntity.ttl,
      dnsName: httpRouterGroupEntity.dnsName,
      fallbackGroups: httpRouterGroupEntity.fallbackGroupsIds,
    };
  };

  //region [[ Singleton ]]
  private static _instance: HttpRouterGroupsProvider | undefined;
  static get instance(): HttpRouterGroupsProvider {
    if (!this._instance) {
      this._instance = new HttpRouterGroupsProvider();
    }

    return this._instance;
  }
  //endregion
}
