import {
  EntitiesApiModel,
  EntityApiModel,
  EntityTypeEnum,
  FlatEntityApiModel,
  ParentEntityApiModel,
  ContainsByTypeEntity,
  ChildEntityApiModel,
} from "../_types/entitiesApiType";

export class QnDeploymentUtils {
  static lastId = 0;

  static obfuscateEntities(entitiesApiModel: EntitiesApiModel): EntitiesApiModel {
    this.lastId = 0;
    const entities = entitiesApiModel.entities.map((entity) => this.obfuscateEntity(entity));
    return {
      entities,
    };
  }

  private static obfuscateEntity(entityApiModel: EntityApiModel): EntityApiModel {
    const contains = entityApiModel?.contains?.map((entity) => this.obfuscateEntity(entity));
    const containedIn = entityApiModel?.containedIn?.map((parentEntity) => this.obfuscateParentEntity(parentEntity));

    const containsByType = entityApiModel.containsByType
      ? this.obfuscateContainsByType(entityApiModel.containsByType)
      : undefined;
    const containedInByType = entityApiModel.containedInByType
      ? this.obfuscateContainsByType(entityApiModel.containedInByType)
      : undefined;

    const currentId = this.lastId++;

    return {
      ...entityApiModel,
      name: entityApiModel.type + currentId,
      uiSystemId: entityApiModel.attributes?.["systemId"] ? "SystemId" + currentId : undefined,
      contains,
      containedIn,
      containsByType,
      containedInByType,
    };
  }

  private static obfuscateContainsByType(entity: ContainsByTypeEntity): ContainsByTypeEntity {
    const newEntity: ContainsByTypeEntity = {};
    Object.keys(entity).forEach((key) => {
      const keyAsType = key as EntityTypeEnum;

      if (entity[keyAsType]) {
        newEntity[keyAsType] = entity[keyAsType]?.map((flatEntity: FlatEntityApiModel) =>
          this.obfuscateFlatEntity(flatEntity)
        );
      }
    });

    return newEntity;
  }

  private static obfuscateParentEntity(parentEntityApiModel: ParentEntityApiModel): ParentEntityApiModel {
    const currentId = this.lastId++;

    return {
      ...parentEntityApiModel,
      name: parentEntityApiModel.type + currentId,
      uiSystemId: parentEntityApiModel.attributes?.["systemId"] ? "SystemId" + currentId : undefined,
      contains: parentEntityApiModel.contains.map((entity) => this.obfuscateChildEntity(entity)),
    };
  }

  private static obfuscateChildEntity(childEntityApiModel: ChildEntityApiModel): ChildEntityApiModel {
    const currentId = this.lastId++;

    return {
      ...childEntityApiModel,
      name: childEntityApiModel.type + currentId,
      uiSystemId: childEntityApiModel.attributes?.["systemId"] ? "SystemId" + currentId : undefined,
      contains: childEntityApiModel.contains.map((entity) => this.obfuscateFlatEntity(entity)),
    };
  }

  private static obfuscateFlatEntity(flatEntityApiModel: FlatEntityApiModel): FlatEntityApiModel {
    const currentId = this.lastId++;

    return {
      ...flatEntityApiModel,
      name: flatEntityApiModel.type + currentId,
      uiSystemId: flatEntityApiModel.attributes?.["systemId"] ? "SystemId" + currentId : undefined,
    };
  }
}
