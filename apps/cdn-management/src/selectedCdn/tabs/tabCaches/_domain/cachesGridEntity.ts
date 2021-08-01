import { loggerCreator } from "common/utils/logger";
import { mockUtils } from "common/utils/mockUtils";
import { HierarchyEntity, SelectionModeEnum } from "common/utils/hierarchyUtils";
import { CacheOperationalModeApiEnum } from "common/backend/cdns/_types/deliveryUnitApiType";
import { CacheEntity } from "src/_domain/cacheEntity";

const moduleLogger = loggerCreator(__filename);

export enum CachesGridEntityType {
  NETWORK = "network",
  CACHE_GROUP = "cache-group",
  CACHE = "cache",
}

export class CachesGridEntity implements HierarchyEntity {
  parent?: CachesGridEntity;
  children?: CachesGridEntity[];

  id!: string;
  name!: string;
  selection!: SelectionModeEnum;
  type!: CachesGridEntityType;
  cache?: CacheEntity;

  get isCache(): boolean {
    return this.type === CachesGridEntityType.CACHE;
  }

  get isCacheSelected(): boolean {
    return this.isCache && this.selection === SelectionModeEnum.SELECTED;
  }

  get isOnline(): boolean {
    return this.cache?.operationalMode
      ? [CacheOperationalModeApiEnum.ONLINE, CacheOperationalModeApiEnum.FORCE_ONLINE].includes(
          this.cache?.operationalMode
        )
      : false;
  }

  constructor(data: Omit<CachesGridEntity, "isCache" | "isCacheSelected" | "isOnline">) {
    Object.assign(this, data);
  }
  // Mock
  static createMock(overrides?: Partial<CachesGridEntity>, id: number = mockUtils.sequentialId()) {
    return new CachesGridEntity({
      children: [],
      parent: undefined,
      selection: SelectionModeEnum.NOT_SELECTED,
      type: CachesGridEntityType.CACHE,
      id: id.toString(),
      name: `Cache ${id}`,
      cache: CacheEntity.createMock(),
      ...overrides,
    });
  }
}
