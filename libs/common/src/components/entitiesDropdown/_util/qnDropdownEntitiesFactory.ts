import { DropdownEntity } from "common/components/entitiesDropdown/_domain/dropdownEntity";
import { EntityTypeEnum } from "common/backend/qnDeployment/_types/entitiesApiType";
import { Utils } from "common/utils/utils";
import { HierarchyUtils, SelectionModeEnum } from "common/utils/hierarchyUtils";
import { loggerCreator } from "common/utils/logger";
import { UrlStore } from "common/stores/urlStore/urlStore";
import { RowItem } from "common/components/entitiesDropdown/_common/rowItem/RowItem";
import { DeploymentEntityWithChildren } from "common/domain/qwiltDeployment/deploymentEntityWithChildren";
import { CommonUrlParams } from "common/urlParams/commonUrlParams";
import { DeploymentEntity } from "common/domain/qwiltDeployment/deploymentEntity";
import { Icons } from "common/styling/icons";

const moduleLogger = loggerCreator(__filename);

export class QnDropdownEntitiesFactory {
  static fromQnDeploymentHierarchy(
    entities: DeploymentEntityWithChildren[],
    obfuscateIcons: boolean = false
  ): { qnDropdownEntities: DropdownEntity[]; qnsCount: number } {
    const qnDropdownEntities =
      entities.map(entity => this.createRecursiveTree(entity, entity, obfuscateIcons)).filter(Utils.isTruthy) || [];

    return {
      qnDropdownEntities,
      qnsCount: HierarchyUtils.countLeafEntities<DropdownEntity>(qnDropdownEntities || []),
    };
  }

  private static createRecursiveTree(
    entity: DeploymentEntityWithChildren,
    parentNetworkEntity?: DeploymentEntityWithChildren,
    obfuscateIcons: boolean = false
  ): DropdownEntity | undefined {
    const filteredChildren = entity.children.filter(child => {
      return child.type === EntityTypeEnum.QN || child.children.length > 0;
    });

    // we want to show only parent that have QN type leaf children
    // in order to filter we only create the entity if filteredChildren exist (recursively)
    // and then we filter out undefined values
    const children = filteredChildren
      .map(child => this.createRecursiveTree(child, parentNetworkEntity))
      .filter(Utils.isTruthy);

    if (entity.type === EntityTypeEnum.QN || children.length > 0) {
      const selection = this.getSelectionState(entity, children, parentNetworkEntity);
      const { iconGetter, iconPath } = this.getEntityIcon(entity, obfuscateIcons);

      return new DropdownEntity({
        id: entity.id.toString(),
        label: entity.name,
        rowRenderer: dropdownEntity => RowItem({ entity: dropdownEntity }),
        iconGetter,
        iconPath,
        isExpanded: selection === SelectionModeEnum.PARTIAL,
        selection,
        children,
      });
    }
  }

  private static getEntityIcon(apiEntity: DeploymentEntity, obfuscateIcons = false) {
    let iconGetter: ((selection: SelectionModeEnum) => string) | undefined;
    let iconPath;
    if (apiEntity.type !== EntityTypeEnum.NETWORK) {
      iconGetter = selection =>
        Icons.getDeploymentEntityIcon(apiEntity, { isBold: selection !== SelectionModeEnum.NOT_SELECTED });
    } else {
      iconPath = Icons.getDeploymentEntityIcon(apiEntity, { hideIspIcon: obfuscateIcons });
    }
    return { iconGetter, iconPath };
  }

  private static getSelectionState(
    entity: DeploymentEntityWithChildren,
    dropdownChildren: DropdownEntity[] | undefined,
    parentNetworkEntity: DeploymentEntityWithChildren | undefined
  ): SelectionModeEnum {
    const restrictedQns = UrlStore.getInstance().getArrayParam(CommonUrlParams.restrictQn);
    const restrictedNetworks = UrlStore.getInstance().getArrayParam(CommonUrlParams.restrictNetwork);
    const isNetworkRestricted = restrictedQns.size === 0 && restrictedNetworks.size > 0;
    const isQnSelectedByNetwork =
      parentNetworkEntity &&
      (restrictedNetworks.has(parentNetworkEntity.id.toString()) ||
        restrictedNetworks.has(parentNetworkEntity.uniqueName));
    const isQnSelected = isNetworkRestricted
      ? isQnSelectedByNetwork
      : restrictedQns.size === 0 || restrictedQns.has(entity.id.toString()) || restrictedQns.has(entity.uniqueName);

    const allChildrenSelected =
      dropdownChildren !== undefined &&
      dropdownChildren.length > 0 &&
      dropdownChildren.every(({ selection }) => selection === SelectionModeEnum.SELECTED);

    const isSelected = (entity.type === EntityTypeEnum.QN && isQnSelected) || allChildrenSelected;

    const isPartialSelected =
      !isSelected && !!dropdownChildren?.some(({ selection }) => selection !== SelectionModeEnum.NOT_SELECTED);

    if (isSelected) {
      return SelectionModeEnum.SELECTED;
    } else if (isPartialSelected) {
      return SelectionModeEnum.PARTIAL;
    } else {
      return SelectionModeEnum.NOT_SELECTED;
    }
  }
}
