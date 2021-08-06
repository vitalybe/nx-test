import { HierarchyUtils } from "../../../../utils/hierarchyUtils";
import {
  CommonDsEntity,
  DsEntityType,
} from "./commonDsEntity";

export class DsViewData<T extends CommonDsEntity = CommonDsEntity> {
  isDataPopulated?: boolean = true;

  entities!: T[];

  constructor(data: Pick<DsViewData, "entities">) {
    Object.assign(this, data);
  }

  get flatEntitiesList(): T[] {
    return HierarchyUtils.flatEntitiesHierarchy(this.entities);
  }

  getEntitiesOfType(type: DsEntityType) {
    return this.flatEntitiesList.filter(entity => entity.type === type);
  }

  // Mock
  static createMock() {
    return new DsViewData({
      entities: [
        CommonDsEntity.createCommonEntityMock(1, {
          type: DsEntityType.DS,
        }),
      ],
    });
  }
}
