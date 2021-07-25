export enum DispersionCalculationMethodsEnum {
  SET = "set",
  FACTOR = "factor",
}

export interface DeliveryUnitGroupEditApiType {
  name: string;
  type: "edge" | "mid" | "both";
  longitude: number;
  latitude: number;
  fallbackDeliveryUnitGroups: string[];
  parentDeliveryUnitGroupId: string | null;
  networkId: number | null;

  // NOTE: Remove ? when tempFlag_cacheGroupDispersion is removed
  dispersionCalculationMethod?: DispersionCalculationMethodsEnum;
  dispersion?: number;
}

export interface DeliveryUnitGroupApiType extends DeliveryUnitGroupEditApiType {
  duGroupId: string;
  cdnId: string;
}

export interface DeliveryUnitGroupApiResult {
  duGroups: DeliveryUnitGroupApiType[];
}
