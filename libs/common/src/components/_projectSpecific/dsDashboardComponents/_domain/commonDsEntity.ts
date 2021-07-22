import { HistogramSeries } from "common/utils/histograms/domain/histogramSeries";
import { HierarchyEntity } from "common/utils/hierarchyUtils";
import { mockUtils } from "common/utils/mockUtils";
import { MetadataServiceTypeEnum } from "common/backend/deliveryServices/_types/deliveryServiceMetadataTypes";

export type EntityTypeDictionary<T = string> = { [k in DsEntityType]?: T };

export enum DsEntityType {
  DS = "ds",
  DSG = "dsg",
  DS_VERSION = "ver",
  ISP = "isp",
  CP = "cp",
}
export type CommonDsEntityGetterFields = "treeId" | "privateId" | "status" | "displayName" | "activeChildrenCount";
export type CommonDsEntityDataType = Omit<CommonDsEntity, CommonDsEntityGetterFields> & {
  _displayName?: string | undefined;
};

interface ErrorCodesObject {
  "4xx": number;
  "5xx": number;
}

export class CommonDsEntity implements HierarchyEntity {
  name!: string;
  type!: DsEntityType;

  isActive?: boolean = true;
  isSelected?: boolean = false;

  children?: CommonDsEntity[];
  parent?: CommonDsEntity;
  //charts
  histograms?: { [key: string]: HistogramSeries };
  //map
  location?: {
    country: string;
    coordinates: [number, number];
  };

  volume?: number;
  efficiency?: number;
  reservedBandwidth?: number;
  errorCodes?: ErrorCodesObject & {
    breakdown?: {
      cached: ErrorCodesObject; // by qwilt
      nonCachedOrigin: ErrorCodesObject; // by origin
      nonCachedQwilt: ErrorCodesObject; // by qwilt
    };
  };
  subscribers?: number;
  serviceTypes?: MetadataServiceTypeEnum[] = [];
  cdns?: string[] = [];
  peakBandwidth?: number;
  bitrate?: number;
  hitRate?: number;
  isps?: string[];

  icon?: string | undefined;
  color?: string | undefined;

  // can be used for setting a color for visualisation of the entity in components
  // example: indicate the service of the entity by service color as theme color
  themeColor?: string | undefined;

  private _displayName?: string | undefined;

  constructor(private _id: string, data: CommonDsEntityDataType) {
    Object.assign(this, data);
  }

  get displayName() {
    return this._displayName ?? this.name;
  }

  get activeChildrenCount() {
    return this.children?.filter((child) => child.isActive).length || 0;
  }

  get status(): string | undefined {
    if (this.children) {
      return `${this.activeChildrenCount}/${this.children.length} Active`;
    }
  }

  set treeId(value: string) {
    this._id = value;
  }

  //child id with parents
  get treeId(): string {
    if (this.parent) {
      return `${this.parent.treeId}_${this._id}`;
    }
    return this._id;
  }

  // child-only id
  get privateId(): string {
    return this._id;
  }

  static createCommonEntityMock<T extends CommonDsEntity = CommonDsEntity>(
    divisor: number = 1,
    overrides: Partial<T> = {}
  ): T {
    const id = mockUtils.sequentialId();
    const type = overrides.type || DsEntityType.DS;
    return new CommonDsEntity(id.toString(), {
      type,
      name: `${type.toUpperCase()}-${id}`,
      isActive: true,
      histograms: {},
      reservedBandwidth: undefined,
      errorCodes: {
        "4xx": 56,
        "5xx": 32,
        cached: 75,
        nonCached: 25,
      },
      subscribers: overrides.parent?.subscribers ? overrides.parent.subscribers / divisor : 0,
      serviceTypes: [MetadataServiceTypeEnum.LIVE, MetadataServiceTypeEnum.MUSIC],
      ...overrides,
    }) as T;
  }
}
