/* eslint-disable unused-imports/no-unused-vars */
import { AjaxMetadata } from "../../../utils/ajax";
import { mockNetworkSleep } from "../../../utils/mockUtils";
import { sleep } from "../../../utils/sleep";
import { AuthDataApi } from "../../authData";
import {
  AccountEmailVerificationStatus,
  AccountsApiUser,
  AccountsApiUsersResult,
  AccountStatusEnum,
  AuthDataGroupsApiResponse,
  OrganizationsApiResponse,
} from "../_types/authDataTypes";
import { loggerCreator } from "../../../utils/logger";
import _ from "lodash";

const moduleLogger = loggerCreator("__filename");
const authDataApiRolesResult: AuthDataGroupsApiResponse = require("./qc-auth-data-prod-roles.json");
const authDataApiTenantsResult: AuthDataGroupsApiResponse = require("./qc-auth-data-prod-tenants.json");
const authDataApiOrgResult: OrganizationsApiResponse = require("./qc-auth-data-prod-orgs.json");

export class AuthDataApiMock implements AuthDataApi {
  async roleGroups(metadata: AjaxMetadata): Promise<AuthDataGroupsApiResponse> {
    await sleep(mockNetworkSleep);
    return {
      groups: _.pickBy(authDataApiRolesResult.groups, (v, key) => key.startsWith("role-")),
    };
  }
  async tenantGroups(metadata: AjaxMetadata): Promise<AuthDataGroupsApiResponse> {
    await sleep(mockNetworkSleep);
    return {
      groups: _.pickBy(authDataApiTenantsResult.groups, (v, key) => key.startsWith("tenant-")),
    };
  }
  async allowedOrganizations(metadata: AjaxMetadata): Promise<OrganizationsApiResponse> {
    await sleep(mockNetworkSleep);
    return authDataApiOrgResult;
  }

  async users(metadata: AjaxMetadata): Promise<AccountsApiUsersResult> {
    await sleep(mockNetworkSleep);

    return {
      users: [
        {
          id: "1",
          status: AccountStatusEnum.ACTIVE,
          profile: {
            firstName: "Rick",
            lastName: "Sanchez",
            login: "ricks@qwilt.com",
          },
          groups: [
            "role-coverage-upload-read",
            "role-client-mapping",
            "role-snowball-edit",
            "role-keys-manager-edit",
            "tenant-british-telecom",
            "tenant-mediacom",
            "tenant-charter-hawaii",
            "role-qc-service-content-publishers-owner",
          ],
        },
        {
          id: "2",
          status: AccountStatusEnum.ACTIVE,
          profile: {
            firstName: "Jerry",
            lastName: "Smith",
            login: "jerrys@qwil.com",
          },
          groups: ["role-snowball-edit", "tenant-warner-media", "role-qc-service-ds-dashboard-ds-viewer"],
        },
        {
          id: "3",
          status: AccountStatusEnum.ACTIVE,
          profile: {
            firstName: "Morty",
            lastName: "Smith",
            login: "mortys@qwilt.com",
            emailVerificationStatus: AccountEmailVerificationStatus.UNVERIFIED,
          },
          groups: ["role-snowball-edit", "tenant-charter-hawaii"],
        },
      ],
    };
  }

  async getUser(metadata: AjaxMetadata): Promise<AccountsApiUser> {
    await sleep(mockNetworkSleep);

    return {
      id: "1",
      status: AccountStatusEnum.ACTIVE,
      profile: {
        firstName: "Rick",
        lastName: "Sanchez",
        login: "ricks@qwilt.com",
      },
      groups: [
        "role-coverage-upload-read",
        "role-client-mapping",
        "role-snowball-edit",
        "role-keys-manager-edit",
        "tenant-british-telecom",
        "tenant-mediacom",
        "tenant-charter-hawaii",
        "role-qc-service-content-publishers-owner",
      ],
    };
  }
  //region [[ Singleton ]]
  protected static _instance: AuthDataApiMock | undefined;
  static get instance(): AuthDataApiMock {
    if (!this._instance) {
      this._instance = new AuthDataApiMock();
    }

    return this._instance;
  }
  //endregion
}
