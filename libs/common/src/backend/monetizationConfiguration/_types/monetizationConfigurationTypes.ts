import { CurrencyUnitEnum } from "common/components/_projectSpecific/monetization/_utils/currencyUtils";
import { MetadataServiceTypeEnum } from "../../deliveryServices/_types/deliveryServiceMetadataTypes";

export interface ApiSpContractType {
  contractId: string;
  contractName: string;
  sp: string;
  capacityMbps: number; // Mbps
  startDate: number; // epoch seconds
  duration: number; // days count
  financingAmount?: number;
  currency: string;
  operationalMode: "active" | "disabled" | "draft";
  hideExpectedFinancingEndDate: boolean;
  phases: ApiSpContractPhaseType[];
}

export interface ApiSpContractPhaseType {
  type: "financing" | "revenueStream";
  startDate?: number; // epoch seconds
  estimatedEndDate?: number;
  revenueSharingPercent: number;
}

export interface ApiCpContractType {
  contractId: string;
  contractName: string;
  cp: string;
  startDate: number; // epoch seconds
  endDate: number; // epoch seconds
  serviceTypes?: MetadataServiceTypeEnum[];
  dsIds?: string[];
  qnDepContexts: number[]; // QND IDs
  currency: CurrencyUnitEnum;
  operationalMode: "active" | "disabled" | "draft";
  policies: ApiCpPolicyType[];
}

export interface ApiCpPolicyType {
  fromVolume: number; // MB
  toVolume: number; // MB
  rate: number; // USD per MB
}
