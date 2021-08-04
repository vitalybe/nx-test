import { loggerCreator } from "common/utils/logger";
import { getOriginForApi } from "common/backend/backendOrigin";
import { combineUrl } from "common/utils/combineUrl";
import { UrlParams } from "common/backend/_utils/urlParams";
import { Ajax, AjaxMetadata } from "common/utils/ajax";
import { devToolsStore } from "common/components/devTools/_stores/devToolsStore";
import { AuthDataApiMock } from "common/backend/authData";
import {
  AccountsApiUser,
  AccountsApiUsersResult,
  AuthDataGroupsApiResponse,
  OrganizationsApiResponse,
} from "common/backend/authData/_types/authDataTypes";
import { MockWrapperProxy } from "common/backend/_utils/mockWrapperProxy/mockWrapperProxy";

const moduleLogger = loggerCreator(__filename);
const BACKEND_URL = combineUrl(getOriginForApi("auth-data"), "/api/2/");

export class AuthDataApi {
  protected constructor() {}

  async roleGroups(metadata: AjaxMetadata): Promise<AuthDataGroupsApiResponse> {
    const params = new UrlParams({
      groupPrefix: "role",
    }).stringified;
    const path = combineUrl(BACKEND_URL, "groups", params);

    const data = await Ajax.getJson(path, metadata);
    return data as AuthDataGroupsApiResponse;
  }
  async tenantGroups(metadata: AjaxMetadata): Promise<AuthDataGroupsApiResponse> {
    const params = new UrlParams({
      groupPrefix: "tenant",
    }).stringified;
    const path = combineUrl(BACKEND_URL, "groups", params);

    const data = await Ajax.getJson(path, metadata);
    return data as AuthDataGroupsApiResponse;
  }

  async allowedOrganizations(metadata: AjaxMetadata): Promise<OrganizationsApiResponse> {
    const params = new UrlParams({
      includeByDeliveryAgreements: true,
    }).stringified;

    const path = combineUrl(BACKEND_URL, "organizations", params);

    const data = await Ajax.getJson(path, metadata);
    return data as OrganizationsApiResponse;
  }

  async users(metadata: AjaxMetadata): Promise<AccountsApiUsersResult> {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, "users", params);

    const data = await Ajax.getJson(path, metadata);
    return data as AccountsApiUsersResult;
  }

  async getUser(metadata: AjaxMetadata, id: string): Promise<AccountsApiUser> {
    const params = new UrlParams({ id }).stringified;
    const path = combineUrl(BACKEND_URL, "users", params);

    const data = await Ajax.getJson(path, metadata);
    return data as AccountsApiUser;
  }

  //region [[ Singleton ]]
  protected static _instance: AuthDataApi | undefined;
  static get instance(): AuthDataApi {
    if (!this._instance) {
      const realApi = new AuthDataApi();
      const mockApi = MockWrapperProxy.wrap(realApi, AuthDataApiMock.instance);
      this._instance = !devToolsStore.isMockMode ? realApi : mockApi;
    }

    return this._instance;
  }
  //endregion
}
