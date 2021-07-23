import {
  ApiCpContractType,
  ApiSpContractType,
} from "common/backend/monetizationConfiguration/_types/monetizationConfigurationTypes";

export interface AuditLogApiType {
  id: string;
  timestamp: number; //epoch seconds
  resourceType: AuditLogResourceType;
  operationType: AuditLogOperationTypeEnum;
  service: string;
  message: string;
  username: string;
  additionalTags: Record<AuditLogAdditionalTagType, string>;
  resource: ApiSpContractType | ApiCpContractType;
}

export interface AuditLogApiResult {
  totalPages: number;
  records: AuditLogApiType[];
}

export interface AuditLogApiRequest {
  sortBy?: AuditLogSortByEnum;
  recordsPerPage?: number;
  pageNumber?: number;
  from: number;
  to?: number;
  resources?: AuditLogResourceType[];
  additionalTags?: AuditLogAdditionalTagType[];
}

export enum AuditLogSortByEnum {
  TIMESTAMP_ASC = "+timestamp",
  TIMESTAMP_DESC = "-timestamp",
  USER_ASC = "+user",
  USER_DESC = "-user",
  TYPE_ASC = "+type",
  TYPE_DESC = "-type",
  DESCRIPTION_ASC = "+description",
  DESCRIPTION_DESC = "-description",
}

export enum AuditLogOperationTypeEnum {
  UPDATE = "Update",
  CREATE = "Create",
  DELETE = "Delete",
}

export type AuditLogResourceType =
  | "monetization-isp-contract"
  | "monetization-cp-contract"
  | "monetization-isp-payment"
  | "monetization-cp-payment";

export type AuditLogAdditionalTagType = "contractName" | "contractId" | "paymentTitle";
