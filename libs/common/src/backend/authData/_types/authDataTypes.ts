// roles and tenants

export interface AuthDataApiIdentifiersDict extends AuthDataApiDict {
  name?: string;
  type?: string;
  orgId?: string;
  orgName?: string;
}
export interface AuthDataApiPermission {
  [key: string]: boolean;
}
export interface AuthDataApiPermissionsDict {
  [key: string]: AuthDataApiPermission;
}

export interface AuthDataApiAccessControlDict {
  [key: string]: string[] | undefined;
  contentPublishers?: string[];
  footprint?: string[];
  CDN?: string[];
  keys?: string[];
  secrets?: string[];
  qnDeployment?: string[];
  "qnDeploymentContainedIn.ids"?: string[];
  nmaEvents?: string[];
}
export interface AuthDataApiDict {
  [key: string]: string | undefined;
}
export interface AuthDataApiFrontendData {
  permissions: AuthDataApiPermissionsDict;
  dataAccessControl: AuthDataApiAccessControlDict;
}

export interface AuthDataApiRule {
  identifiers: AuthDataApiIdentifiersDict;
  permissions: AuthDataApiPermissionsDict;
  dataAccessControl: AuthDataApiAccessControlDict;
  env: AuthDataApiDict;
  frontend: AuthDataApiFrontendData;
  groups: string[];
}

export interface AuthDataApiGroups {
  [id: string]: AuthDataApiRule;
}
export interface AuthDataGroupsApiResponse {
  groups: AuthDataApiGroups;
}

// organizations
export interface OrgApiType {
  id: string;
  name: string | null;
  type: "CP" | "SP" | "QWILT";
}
export interface OrganizationsApiResponse {
  organizations: OrgApiType[];
}

// users
export enum AccountStatusEnum {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export enum AccountEmailVerificationStatus {
  UNVERIFIED = "UNVERIFIED",
}

export interface AccountsApiUser {
  id: string;
  status: AccountStatusEnum;
  profile: {
    firstName: string;
    lastName: string;
    login: string;
    emailVerificationStatus?: AccountEmailVerificationStatus;
  };
  groups: string[];
}

export interface AccountsApiUsersResult {
  users: AccountsApiUser[];
}
