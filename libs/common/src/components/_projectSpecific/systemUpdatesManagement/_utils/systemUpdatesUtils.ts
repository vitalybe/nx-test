import * as _ from "lodash";
import { loggerCreator } from "common/utils/logger";
import { ComponentTypeEnum } from "common/backend/systemEvents/_types/systemEventsTypes";
import { DeploymentEntityWithChildren } from "common/domain/qwiltDeployment/deploymentEntityWithChildren";
import { EntityTypeEnum } from "common/backend/qnDeployment/_types/entitiesApiType";
import { HierarchyUtils } from "common/utils/hierarchyUtils";

const moduleLogger = loggerCreator(__filename);

export class SystemUpdatesUtils {
  static getComponentDisplayName(component: ComponentTypeEnum): string {
    if (component === ComponentTypeEnum.QCP_VERSION) {
      return "QCP Version";
    } else if (component === ComponentTypeEnum.QCP_CONFIGURATION) {
      return "QCP Configuration";
    } else if (component === ComponentTypeEnum.DS_UPDATE) {
      return "DS Update";
    } else {
      return component;
    }
  }

  static getAffectedEntitiesTexts(ids: number[], networksHierarchy: DeploymentEntityWithChildren[]): string[] {
    const shownOrder: EntityTypeEnum[] = [
      EntityTypeEnum.NETWORK,
      EntityTypeEnum.REGION,
      EntityTypeEnum.COUNTRY,
      EntityTypeEnum.STATE,
      EntityTypeEnum.MARKET,
      EntityTypeEnum.SITE,
      EntityTypeEnum.QN,
    ];

    const selectedEntities: { network: DeploymentEntityWithChildren; entity: DeploymentEntityWithChildren }[] = [];
    for (const network of networksHierarchy) {
      if (ids.includes(network.id)) {
        selectedEntities.push({ network: network, entity: network });
      } else {
        selectedEntities.push(
          ...HierarchyUtils.getChildren(network, child => ids.includes(child.id)).map(child => ({
            network: network,
            entity: child,
          }))
        );
      }
    }

    const sortedSelectedEntities = _.orderBy(selectedEntities, selectedEntity =>
      shownOrder.indexOf(selectedEntity.entity.type)
    );

    return sortedSelectedEntities.map(sortedSelectedEntity => {
      let text: string;
      const network = sortedSelectedEntity.network;
      const entity = sortedSelectedEntity.entity;

      if (entity.type === EntityTypeEnum.NETWORK) {
        text = `${entity.name} (Entire Network)`;
      } else {
        text = `${entity.name} (${entity.type} in "${network.name}" Network)`;
      }

      return text;
    });
  }

  private constructor() {}
}
