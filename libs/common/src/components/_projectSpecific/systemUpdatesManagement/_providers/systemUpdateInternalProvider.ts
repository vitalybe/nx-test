import { SystemEventsInternalApi } from "../../../../backend/systemEvents";
import {
  ScopeTypeDs,
  ScopeTypeQn,
  SystemUpdateInternalApiPayloadType,
  SystemUpdateInternalApiType,
} from "../../../../backend/systemEvents/_types/systemEventsTypes";
import { SystemUpdateInternalEntity } from "../_domain/systemUpdateInternalEntity";
import {
  SystemUpdateKind,
  SystemUpdateSchemaType,
} from "../_domain/systemUpdateSchema";
import { AjaxMetadata } from "../../../../utils/ajax";
import { loggerCreator } from "../../../../utils/logger";
import { Utils } from "../../../../utils/utils";
import { DateTime } from "luxon";

const moduleLogger = loggerCreator("__filename");

export class SystemUpdateInternalProvider {
  private constructor() {}

  provide = async (metadata: AjaxMetadata): Promise<SystemUpdateInternalEntity[]> => {
    const { updates: systemUpdatesApi } = await SystemEventsInternalApi.instance.listSystemUpdates(metadata);

    return systemUpdatesApi.map((systemUpdateApi) => this.fromApiType(systemUpdateApi));
  };

  private fromApiType(systemUpdateApi: SystemUpdateInternalApiType) {
    const qnDeploymentIdsFromScope = systemUpdateApi.scope
      .flatMap((scopeItem) =>
        scopeItem.scopeType === "qnDeployment" ? scopeItem.qnDeploymentScopeDetails?.ids : undefined
      )
      .filter(Utils.isTruthy);

    const dsIdsFromScope = systemUpdateApi.scope
      .flatMap((scopeItem) => (scopeItem.scopeType === "deliveryService" ? scopeItem.dsScopeDetails?.ids : undefined))
      .filter(Utils.isTruthy);

    const endTime = DateTime.fromSeconds(systemUpdateApi.startTimeEpoch + systemUpdateApi.expectedDuration);
    return new SystemUpdateInternalEntity({
      id: systemUpdateApi.updateId,
      component: systemUpdateApi.component,
      isCustomerFacing: systemUpdateApi.exposure === "public",
      kind: systemUpdateApi.method,
      startTime: DateTime.fromSeconds(systemUpdateApi.startTimeEpoch),
      endTime: endTime,
      affectedQnDeploymentIds: qnDeploymentIdsFromScope,
      affectedDsIds: dsIdsFromScope,
      expectedEffect: systemUpdateApi.expectedEffect,
      internalDescription: systemUpdateApi.internalDescription,
      externalDescription: systemUpdateApi.externalDescription,
      lateArrivals: systemUpdateApi.lateArrivalDuration
        ? endTime.plus({ seconds: systemUpdateApi.lateArrivalDuration })
        : undefined,
    });
  }

  private toApiType(formEntity: SystemUpdateSchemaType): SystemUpdateInternalApiPayloadType {
    const scopes: (ScopeTypeQn | ScopeTypeDs)[] = [];
    if (formEntity.affectedQnDeploymentIds?.length) {
      scopes.push({
        scopeType: "qnDeployment",
        qnDeploymentScopeDetails: {
          ids: formEntity.affectedQnDeploymentIds,
        },
      });
    }

    if (formEntity.affectedDsIds) {
      scopes.push({
        scopeType: "deliveryService",
        dsScopeDetails: {
          ids: formEntity.affectedDsIds,
        },
      });
    }
    const apiEntity: SystemUpdateInternalApiPayloadType = {
      component: formEntity.component,
      exposure: formEntity.isCustomerFacing ? "public" : "internal",
      method: formEntity.kind === SystemUpdateKind.SCHEDULED ? "scheduled" : "timely",
      startTimeEpoch: (formEntity.startTime as DateTime).toSeconds(),
      expectedDuration: (formEntity.endTime as DateTime).diff(formEntity.startTime as DateTime).as("seconds"),
      scope: scopes,
      expectedEffect: formEntity.expectedEffect ?? "",
      internalDescription: formEntity.internalDescription ?? "",
      externalDescription: formEntity.externalDescription ?? "",
      lateArrivalDuration: formEntity.lateArrivals ? formEntity.lateArrivals.diff(DateTime.local()).as("seconds") : 0,

      metaData: {},
    };

    return apiEntity;
  }

  create = async (formEntity: SystemUpdateSchemaType): Promise<SystemUpdateInternalEntity> => {
    const apiEntity = this.toApiType(formEntity);

    const createdEntity = await SystemEventsInternalApi.instance.createSystemUpdate(apiEntity);
    return this.fromApiType(createdEntity.updates[0]);
  };

  update = async (id: string, formEntity: SystemUpdateSchemaType) => {
    const apiEntity = this.toApiType(formEntity);

    const updatedEntity = await SystemEventsInternalApi.instance.updateSystemUpdates(id, apiEntity);
    return this.fromApiType(updatedEntity.updates[0]);
  };

  delete = async (id: string) => {
    await SystemEventsInternalApi.instance.deleteSystemUpdate(id);
  };

  //region [[ Singleton ]]
  private static _instance: SystemUpdateInternalProvider | undefined;
  static get instance(): SystemUpdateInternalProvider {
    if (!this._instance) {
      this._instance = new SystemUpdateInternalProvider();
    }

    return this._instance;
  }
  //endregion
}
