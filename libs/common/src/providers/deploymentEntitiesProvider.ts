import { CommonUrlParams } from "common/urlParams/commonUrlParams";
import { GlobalStore } from "common/stores/globalStore";
import {
  EntitiesParams,
  EntitiesParamsEnum,
  EntityApiModel,
  EntityTypeEnum,
} from "common/backend/qnDeployment/_types/entitiesApiType";
import { UrlStore } from "common/stores/urlStore/urlStore";
import { DeploymentEntity } from "common/domain/qwiltDeployment/deploymentEntity";
import { AjaxMetadata } from "common/utils/ajax";
import { loggerCreator } from "common/utils/logger";
import { QnDeploymentEntity } from "common/domain/qwiltDeployment/qnDeploymentEntity";
import { DeploymentEntityWithChildren } from "common/domain/qwiltDeployment/deploymentEntityWithChildren";
import { QnDeploymentApi } from "common/backend/qnDeployment";
import { Utils } from "common/utils/utils";
import { PrepareQueryResult } from "common/utils/reactQueryUtils/prepareQueryResult";

const moduleLogger = loggerCreator(__filename);

export class DeploymentEntitiesProvider {
  provideQns = async (
    metadata: AjaxMetadata,
    ignoreUrlParamEntitiesRestrictions = false,
    ignoreUrlParamQnVersionRestriction = false,
    ignoreHideInNMA = true
  ): Promise<QnDeploymentEntity[]> => {
    const params: EntitiesParams = {
      types: EntityTypeEnum.NETWORK,
      entities_list_format: "details",
      contained_in_list_format: "none",
      contains_list_format: "details",
      contains_list_group_by_type: "true",
      contains_list_deep: "true",
    };

    const restrictedQns = [...UrlStore.getInstance().getArrayParam(CommonUrlParams.restrictQn)];
    const restrictedNetworks = [...UrlStore.getInstance().getArrayParam(CommonUrlParams.restrictNetwork)];

    if (!ignoreUrlParamEntitiesRestrictions && restrictedNetworks.length > 0) {
      params[EntitiesParamsEnum.IDS] = restrictedNetworks.join(",");
    }

    const { entities: networksEntities } = await QnDeploymentApi.instance.entitiesList(params, metadata);

    const qns = networksEntities.flatMap((network) => {
      const networkEntity = new DeploymentEntity({
        name: network.name,
        uniqueName: network.uniqueName,
        id: network.id,
        type: EntityTypeEnum.NETWORK,
        attributes: network.attributes,
      });

      const isForceHideInCustomerUIs = UrlStore.getInstance().getBooleanParam(CommonUrlParams.forceHideInCustomerUIs);
      const shouldFilterHideInNMA = isForceHideInCustomerUIs ?? !ignoreHideInNMA;

      const qnList =
        network?.containsByType?.qn?.reduce((result: QnDeploymentEntity[], qn) => {
          if (!shouldFilterHideInNMA || qn.attributes["hideInNMA"] !== "true") {
            result.push(this.createQnEntity(qn, networkEntity));
          }

          return result;
        }, []) ?? [];

      const supportedQnsNames = GlobalStore.instance.supportedQnsNames;

      if (!ignoreUrlParamEntitiesRestrictions) {
        let restrictedList = qnList;
        if (restrictedQns.length > 0) {
          restrictedList = qnList.filter((qn) => {
            const ids = [qn.id.toString(), qn.uniqueName, qn.systemId].filter(Utils.isTruthy);
            return ids.some((id) => restrictedQns.includes(id));
          });
        }

        if (!ignoreUrlParamQnVersionRestriction && supportedQnsNames) {
          return restrictedList.filter((qn) => supportedQnsNames.includes(qn.name));
        }

        return restrictedList;
      } else {
        return qnList;
      }
    });

    return qns;
  };

  provideNetworkQns = async (metadata: AjaxMetadata, networkId: string): Promise<QnDeploymentEntity[]> => {
    const params: EntitiesParams = {
      types: EntityTypeEnum.NETWORK,
      entities_list_format: "details",
      contained_in_list_format: "none",
      contains_list_format: "details",
      contains_list_group_by_type: "true",
      contains_list_deep: "true",
      ids: networkId,
    };
    const { entities: networkEntities } = await QnDeploymentApi.instance.entitiesList(params, metadata);

    return networkEntities.flatMap(
      (entity) => entity.containsByType?.qn?.map((qn) => this.createQnEntity(qn, entity)) || []
    );
  };

  prepareQueryNetworks(ignoreRestrictions = false): PrepareQueryResult<DeploymentEntity[]> {
    return new PrepareQueryResult<DeploymentEntity[]>({
      name: "DeploymentEntitiesProvider.prepareQueryNetworks",
      // eslint-disable-next-line prefer-rest-params
      params: [...arguments],
      provide: async (): Promise<DeploymentEntity[]> => {
        return DeploymentEntitiesProvider.instance.provideNetworks(new AjaxMetadata(), ignoreRestrictions);
      },
    });
  }

  provideNetworks = async (
    metadata: AjaxMetadata = new AjaxMetadata(),
    ignoreRestrictions = false
  ): Promise<DeploymentEntity[]> => {
    const params: EntitiesParams = {
      types: EntityTypeEnum.NETWORK,
      entities_list_format: "details",
      contained_in_list_format: "none",
      contains_list_format: "none",
      ...DeploymentEntitiesProvider.getRestrictionParam(ignoreRestrictions),
    };

    const result = await QnDeploymentApi.instance.entitiesList(params, metadata);

    return result.entities.map((entity) => {
      return new DeploymentEntity({
        ...entity,
        type: EntityTypeEnum.NETWORK,
        attributes: this.getAttributes(entity),
      });
    });
  };

  private getAttributes(entity: EntityApiModel) {
    return (
      Object.fromEntries(
        Object.entries(entity.attributes).map(([key, value]) => {
          return [key, value ?? undefined];
        })
      ) ?? undefined
    );
  }

  private createDeploymentEntityWithChildren(entities: EntityApiModel[]): DeploymentEntityWithChildren[] {
    return entities?.map(
      (entity) =>
        new DeploymentEntityWithChildren({
          ...entity,
          type: entity.type,
          children: this.createDeploymentEntityWithChildren(entity.contains ?? []),
          attributes: this.getAttributes(entity),
        }) ?? []
    );
  }

  private createQnEntity(entity: EntityApiModel, networkEntity?: DeploymentEntity) {
    const newQn = new QnDeploymentEntity({
      id: entity.id,
      name: entity.name,
      uniqueName: entity.uniqueName,
      network: networkEntity,
      attributes: this.getAttributes(entity),
    });
    newQn.uiSystemId = entity.uiSystemId;

    return newQn;
  }
  provideNetworkHierarchy = async (
    metadata: AjaxMetadata,
    ignoreRestrictions = false,
    ignoreHideInNMA = true
  ): Promise<DeploymentEntityWithChildren[]> => {
    const params: EntitiesParams = {
      types: EntityTypeEnum.NETWORK,
      contains_list_recursive: "true",
      contains_list_format: "details",
      entities_list_format: "details",
      contained_in_list_format: "none",
      ...DeploymentEntitiesProvider.getRestrictionParam(ignoreRestrictions),
    };

    const result = await QnDeploymentApi.instance.entitiesList(params, metadata);
    const isForceHideInCustomerUIs = UrlStore.getInstance().getBooleanParam(CommonUrlParams.forceHideInCustomerUIs);
    const shouldFilterHideInNMA = isForceHideInCustomerUIs ?? !ignoreHideInNMA;
    if (shouldFilterHideInNMA) {
      result.entities = this.filterHideInNMA(result.entities);
    }

    return this.createDeploymentEntityWithChildren(result?.entities ?? []);
  };

  private static getRestrictionParam(
    ignoreUserRestriction = false
  ): Pick<EntitiesParams, EntitiesParamsEnum.CONTAINS_RECURSIVE | EntitiesParamsEnum.IDS> {
    const params: EntitiesParams = {};
    const restrictedQns = [...UrlStore.getInstance().getArrayParam(CommonUrlParams.restrictQn)];
    const restrictedNetworks = [...UrlStore.getInstance().getArrayParam(CommonUrlParams.restrictNetwork)];
    if (restrictedQns.length && !ignoreUserRestriction) {
      params[EntitiesParamsEnum.CONTAINS_RECURSIVE] = restrictedQns.join(",");
    } else if (restrictedNetworks.length && !ignoreUserRestriction) {
      params[EntitiesParamsEnum.IDS] = restrictedNetworks.join(",");
    }
    return params;
  }

  private filterHideInNMA(entities: EntityApiModel[]): EntityApiModel[] {
    const filteredEntities = entities.filter((entity) => !(entity.attributes["hideInNMA"] === "true"));

    for (const entity of filteredEntities) {
      if (entity.contains) {
        entity.contains = this.filterHideInNMA(entity.contains);
      }
    }

    return filteredEntities;
  }

  //region [[ Singleton ]]
  private static _instance: DeploymentEntitiesProvider | undefined;
  static get instance(): DeploymentEntitiesProvider {
    if (!this._instance) {
      this._instance = new DeploymentEntitiesProvider();
    }

    return this._instance;
  }
  //endregion
}
