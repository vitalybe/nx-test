import { loggerCreator } from "../../../../utils/logger";
import { getOriginForApi } from "../../../backendOrigin";
import { combineUrl } from "../../../../utils/combineUrl";
import { UrlParams } from "../../../_utils/urlParams";
import { Ajax, AjaxMetadata } from "../../../../utils/ajax";
import { devToolsStore } from "../../../../components/devTools/_stores/devToolsStore";
import { DelegationsApiMock } from "../../delegations";
import { DltApiEditType, DltsApiResult } from "../_types/dltTypes";
import {
  RouterSelectionRuleApiEditType,
  RouterSelectionRulesApiResult,
} from "../_types/routerSelectionRulesTypes";
import {
  DelegationApiEditType,
  DelegationApiType,
  DelegationsApiResult,
} from "../_types/delegationTypes";
import {
  DelegationSelectionApiEditType,
  DelegationSelectionApiType,
  DelegationSelectionsApiResult,
} from "../_types/delegationSelectionTypes";

const moduleLogger = loggerCreator("__filename");
const BACKEND_URL = combineUrl(getOriginForApi("coverage"), "/api/1.0.0/delegation");

export class DelegationsApi {
  protected constructor() {}

  //region DLTs
  async listDlts(metadata: AjaxMetadata): Promise<DltsApiResult> {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, "dlts", params);

    const data = await Ajax.getJson(path, metadata);
    return data as DltsApiResult;
  }

  async createDlt(entity: DltApiEditType) {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, "dlts", params);

    await Ajax.postJson(path, entity);
  }

  async deleteDlt(id: string) {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, "dlts", id, params);

    await Ajax.deleteJson(path);
  }
  //endregion

  //region RouterSelectionRules
  async listRouterSelectionRules(metadata: AjaxMetadata): Promise<RouterSelectionRulesApiResult> {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, "router-selection-rules", params);

    const data = await Ajax.getJson(path, metadata);
    return data as RouterSelectionRulesApiResult;
  }

  async createRouterSelectionRules(entity: RouterSelectionRuleApiEditType) {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, "router-selection-rules", params);

    await Ajax.postJson(path, entity);
  }

  async deleteRouterSelectionRules(id: string) {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, "router-selection-rules", id, params);

    await Ajax.deleteJson(path);
  }
  //endregion

  //region Delegations
  async listDelegations(metadata: AjaxMetadata): Promise<DelegationsApiResult> {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, "delegations", params);

    const data = await Ajax.getJson(path, metadata);
    return data as DelegationsApiResult;
  }

  async createDelegations(entity: DelegationApiEditType) {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, "delegations", params);

    await Ajax.postJson(path, entity);
  }

  async updateDelegations(entity: DelegationApiType) {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, "delegations", entity.id, params);

    await Ajax.putJson(path, entity);
  }

  async deleteDelegations(id: string) {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, "delegations", id, params);

    await Ajax.deleteJson(path);
  }
  //endregion

  //region DelegationSelections
  async listDelegationSelections(metadata: AjaxMetadata): Promise<DelegationSelectionsApiResult> {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, "delegation-selections", params);

    const data = await Ajax.getJson(path, metadata);
    return data as DelegationSelectionsApiResult;
  }

  async createDelegationSelections(entity: DelegationSelectionApiEditType) {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, "delegation-selections", params);

    await Ajax.postJson(path, entity);
  }

  async updateDelegationSelections(entity: DelegationSelectionApiType) {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, "delegation-selections", entity.id, params);

    await Ajax.putJson(path, entity);
  }

  async deleteDelegationSelections(id: string) {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, "delegation-selections", id, params);

    await Ajax.deleteJson(path);
  }
  //endregion

  async listDeliveryServices(metadata: AjaxMetadata): Promise<string[]> {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, "delivery-services-names", params);

    const deliveryServices = await Ajax.getJson(path, metadata);
    return deliveryServices as string[];
  }

  //region [[ Singleton ]]
  protected static _instance: DelegationsApi | undefined;
  static get instance(): DelegationsApi {
    if (!this._instance) {
      this._instance = !devToolsStore.isMockMode ? new DelegationsApi() : DelegationsApiMock.instance;
    }

    return this._instance;
  }
  //endregion
}
