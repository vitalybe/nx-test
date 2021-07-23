export enum EntitiesParamsEnum {
  ENTITIES_LIST_FORMAT = "entities_list_format",
  CONTAINED_IN_LIST_FORMAT = "contained_in_list_format",
  CONTAINS_LIST_FORMAT = "contains_list_format",
  CONTAINS_LIST_RECURSIVE = "contains_list_recursive",
  CONTAINED_IN_LIST_DEEP = "contained_in_list_deep",
  CONTAINED_IN_LIST_GROUP_BY_TYPE = "contained_in_list_group_by_type",
  CONTAINS_LIST_GROUP_BY_TYPE = "contains_list_group_by_type",
  CONTAINS_LIST_DEEP = "contains_list_deep",
  IDS = "ids",
  CONTAINED_IN_RECURSIVE = "contained_in_recursive",
  CONTAINS_RECURSIVE = "contains_recursive",
}

export type EntitiesParams = { [key in EntitiesParamsEnum]?: string } & { types?: EntityTypeEnum };

export type ContainsByTypeEntity = { [type in EntityTypeEnum]?: FlatEntityApiModel[] };

export enum EntityTypeEnum {
  REGION = "region",
  COUNTRY = "country",
  STATE = "state",
  NETWORK = "network",
  MARKET = "market",
  SITE = "site",
  QN = "qn",
}

export interface EntityApiModel extends FlatEntityApiModel {
  contains?: EntityApiModel[];
  containsByType?: ContainsByTypeEntity;
  containedIn?: ParentEntityApiModel[];
  containedInByType?: ContainsByTypeEntity;
}

export interface FlatEntityApiModel {
  id: number;
  uniqueName: string;
  name: string;
  type: EntityTypeEnum;
  attributes: { [key: string]: string | undefined };
  uiSystemId?: string;
}

export interface ParentEntityApiModel extends FlatEntityApiModel {
  contains: ChildEntityApiModel[];
}

export interface ChildEntityApiModel extends FlatEntityApiModel {
  contains: FlatEntityApiModel[];
}

export interface EntitiesApiModel {
  entities: EntityApiModel[];
}

export interface PostEntityModel {
  name: string;
  type: string;
  attributes: {
    [k: string]: unknown;
  };
  containedIn: number[];
}

export interface PostResponse extends PostEntityModel {
  id: number;
  uniqueName: string;
  contains: EntityApiModel[];
}

export interface EntityHistoryEntry extends FlatEntityApiModel {
  modifiedBy?: string;
  modifiedDate?: string;
  containedIn: EntityHistoryEntry[];
}

export interface EntityHistoryModel {
  entity: EntityHistoryEntry[];
}
