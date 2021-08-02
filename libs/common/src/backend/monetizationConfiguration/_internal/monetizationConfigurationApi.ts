import { loggerCreator } from "../../../utils/logger";
import { getOriginForApi } from "../../backendOrigin";
import { combineUrl } from "../../../utils/combineUrl";
import { UrlParams } from "../../_utils/urlParams";
import { Ajax, AjaxMetadata } from "../../../utils/ajax";
import { devToolsStore } from "../../../components/devTools/_stores/devToolsStore";
import { MonetizationConfigurationApiMock } from "../../monetizationConfiguration";
import { MockWrapperProxy } from "../../_utils/mockWrapperProxy/mockWrapperProxy";
import {
  ApiCpContractType,
  ApiSpContractType,
} from "../_types/monetizationConfigurationTypes";

const moduleLogger = loggerCreator("__filename");
const BACKEND_URL = combineUrl(getOriginForApi("monetization-docs"), "/api/1/");

export class MonetizationConfigurationApi {
  protected constructor() {}

  async ispContracts(metadata: AjaxMetadata): Promise<ApiSpContractType[]> {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, "contracts/isp/", params);

    const data = await Ajax.getJson(path, metadata);
    return data as ApiSpContractType[];
  }

  async createIspContract(data: Partial<ApiSpContractType>): Promise<unknown> {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, "contracts/isp/", params);

    return await Ajax.postJson(path, data);
  }
  async editIspContract(id: string, data: Partial<ApiSpContractType>): Promise<unknown> {
    const params = new UrlParams({ contractId: id }).stringified;
    const path = combineUrl(BACKEND_URL, "contracts/isp/", params);

    return await Ajax.putJson(path, data);
  }

  async deleteIspContract(id: string) {
    const params = new UrlParams({ contractIds: id }).stringified;
    const path = combineUrl(BACKEND_URL, "contracts/isp/", params);

    await Ajax.deleteJson(path);
  }

  async cpContracts(metadata: AjaxMetadata): Promise<ApiCpContractType[]> {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, "contracts/cp/", params);

    const data = await Ajax.getJson(path, metadata);
    return data as ApiCpContractType[];
  }

  async createCpContract(data: Partial<ApiCpContractType>): Promise<unknown> {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, "contracts/cp/", params);

    return await Ajax.postJson(path, data);
  }
  async editCpContract(id: string, data: Partial<ApiCpContractType>) {
    const params = new UrlParams({ contractId: id }).stringified;
    const path = combineUrl(BACKEND_URL, "contracts/cp/", params);

    return await Ajax.putJson(path, data);
  }

  async deleteCpContract(id: string) {
    const params = new UrlParams({ contractIds: id }).stringified;
    const path = combineUrl(BACKEND_URL, "contracts/cp/", params);

    await Ajax.deleteJson(path);
  }
  //region [[ Singleton ]]
  protected static _instance: MonetizationConfigurationApi | undefined;
  static get instance(): MonetizationConfigurationApi {
    if (!this._instance) {
      const realApi = new MonetizationConfigurationApi();
      const mockApi = MockWrapperProxy.wrap(realApi, MonetizationConfigurationApiMock.instance);
      this._instance = !devToolsStore.isMockMode ? realApi : mockApi;
    }

    return this._instance;
  }
  //endregion
}
