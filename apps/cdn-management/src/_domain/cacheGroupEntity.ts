import { loggerCreator } from "@qwilt/common/utils/logger";
import { mockUtils } from "@qwilt/common/utils/mockUtils";
import { DispersionCalculationMethodsEnum } from "@qwilt/common/backend/cdns/_types/deliveryUnitGroupApiType";
import { NameWithId } from "@qwilt/common/domain/nameWithId";
import mockData from "@qwilt/common/backend/_utils/mockData";

const moduleLogger = loggerCreator("__filename");

export type CacheGroupEntityType = "edge" | "mid" | "both";

interface CacheGroupEntityParams {
  id: string;
  name: string;
  network: NameWithId<number> | undefined;
  type: CacheGroupEntityType;
  latitude: number;
  longitude: number;
  fallbackCacheGroups: CacheGroupEntity[];

  // NOTE: Remove ? when tempFlag_cacheGroupDispersion is removed
  dispersionCalculationMethod?: DispersionCalculationMethodsEnum;
  dispersion?: number;
}

export class CacheGroupEntity {
  constructor(data: CacheGroupEntityParams) {
    Object.assign(this, data);
  }

  public parentCacheGroup: CacheGroupEntity | undefined;
  public childrenCacheGroups: CacheGroupEntity[] = [];

  // Mock
  static createMock(overrides?: Partial<CacheGroupEntityParams>, id: number = mockUtils.sequentialId()) {
    const networkMock = mockData.networksWithId[id % mockData.networksWithId.length];
    const network = new NameWithId<number>({ name: networkMock.name, id: networkMock.id });

    const fallbackGroup1 = new CacheGroupEntity({
      id: id + "_fallback1",
      name: `Fallback group ${id}`,
      network: network,
      type: "edge",
      latitude: 123,
      longitude: 123,
      fallbackCacheGroups: [],
      dispersion: 1,
      dispersionCalculationMethod: DispersionCalculationMethodsEnum.FACTOR,
    });

    const fallbackGroup2 = new CacheGroupEntity({
      id: id + "_fallback2",
      name: `Fallback group ${id}`,
      network: network,
      type: "edge",
      latitude: 123,
      longitude: 123,
      fallbackCacheGroups: [],
      dispersion: 1,
      dispersionCalculationMethod: DispersionCalculationMethodsEnum.FACTOR,
    });

    return new CacheGroupEntity({
      id: id.toString(),
      name: `Group ${id}`,
      network: network,
      type: "edge",
      latitude: 123,
      longitude: 123,
      fallbackCacheGroups: [fallbackGroup1, fallbackGroup2],
      dispersion: 1,
      dispersionCalculationMethod: DispersionCalculationMethodsEnum.FACTOR,
    });
  }
}

// utility - merges parameters as class members
export interface CacheGroupEntity extends CacheGroupEntityParams {}
