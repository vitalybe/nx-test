import { loggerCreator } from "common/utils/logger";
import { getOriginForApi } from "common/backend/backendOrigin";
import { combineUrl } from "common/utils/combineUrl";
import { UrlParams } from "common/backend/_utils/urlParams";
import { Ajax, AjaxMetadata } from "common/utils/ajax";
import { devToolsStore } from "common/components/devTools/_stores/devToolsStore";
import { DsAssignmentsApiMock } from "common/backend/ds-assignments";
import { Omit } from "common/utils/typescriptUtils";
import {
  ApiEntityRuleType,
  ApiRuleAssignment,
  ApiRuleRouting,
  AssignmentsApiType,
  DeliveryUnitRuleApiType,
  ManifestRouterRuleApiType,
  NetworkRuleApiType,
  RoutingDuApiType,
  RoutingNetworkApiType,
} from "common/backend/ds-assignments/_types/dsAssignmentsTypes";
import { MockWrapperProxy } from "common/backend/_utils/mockWrapperProxy/mockWrapperProxy";

const moduleLogger = loggerCreator(__filename);

const BACKEND_URL = combineUrl(getOriginForApi("ds-assignments"), "/api/3.0/");

export class DsAssignmentsApi {
  protected constructor() {}

  //region [[DS Assignment Rules]]
  async getAssignmentRules(cdnId: string, metadata: AjaxMetadata): Promise<AssignmentsApiType> {
    const params = new UrlParams({ cdnId: cdnId }).stringified;
    const path = combineUrl(BACKEND_URL, "ds-assignments/rules/", params);

    const data = await Ajax.getJson(path, metadata);
    return data as AssignmentsApiType;
  }

  async getAllAssignmentRules(metadata: AjaxMetadata): Promise<AssignmentsApiType> {
    const path = combineUrl(BACKEND_URL, "ds-assignments/rules/");

    const data = await Ajax.getJson(path, metadata);
    return data as AssignmentsApiType;
  }

  async deleteAssignmentRule(type: ApiEntityRuleType, ruleId: string) {
    const path = combineUrl(BACKEND_URL, `ds-assignments/rules/${type}/`, ruleId);

    await Ajax.deleteJson(path);
  }

  async createAssignmentRuleCdn(assignmentRule: Omit<ApiRuleAssignment, "ruleId">) {
    const path = combineUrl(BACKEND_URL, "ds-assignments/rules/cdn/");

    await Ajax.postJson(path, assignmentRule);
  }

  async updateAssignmentRuleCdn(assignmentRule: ApiRuleAssignment) {
    const path = combineUrl(BACKEND_URL, "ds-assignments/rules/cdn/", assignmentRule.ruleId);

    await Ajax.putJson(path, assignmentRule);
  }

  async createAssignmentRuleNet(assignmentRule: Omit<ApiRuleAssignment & NetworkRuleApiType, "ruleId">) {
    const path = combineUrl(BACKEND_URL, "ds-assignments/rules/network/");

    await Ajax.postJson(path, assignmentRule);
  }

  async updateAssignmentRuleNet(assignmentRule: ApiRuleAssignment & NetworkRuleApiType) {
    const path = combineUrl(BACKEND_URL, "ds-assignments/rules/network/", assignmentRule.ruleId);

    await Ajax.putJson(path, assignmentRule);
  }

  async createAssignmentRuleDu(assignmentRule: Omit<ApiRuleAssignment & DeliveryUnitRuleApiType, "ruleId">) {
    const path = combineUrl(BACKEND_URL, "ds-assignments/rules/delivery-unit/");

    await Ajax.postJson(path, assignmentRule);
  }

  async updateAssignmentRuleDu(assignmentRule: ApiRuleAssignment & DeliveryUnitRuleApiType) {
    const path = combineUrl(BACKEND_URL, "ds-assignments/rules/delivery-unit/", assignmentRule.ruleId);

    await Ajax.putJson(path, assignmentRule);
  }

  async createAssignmentRuleMr(assignmentRule: Omit<ApiRuleAssignment & ManifestRouterRuleApiType, "ruleId">) {
    const path = combineUrl(BACKEND_URL, "ds-assignments/rules/manifest-router/");

    await Ajax.postJson(path, assignmentRule);
  }

  async updateAssignmentRuleMr(assignmentRule: ApiRuleAssignment & ManifestRouterRuleApiType) {
    const path = combineUrl(BACKEND_URL, "ds-assignments/rules/manifest-router/", assignmentRule.ruleId);

    await Ajax.putJson(path, assignmentRule);
  }
  //endregion

  //region [[DS Routing Rules - DU]]
  async getRoutingRulesDu(cdnId: string, metadata: AjaxMetadata): Promise<RoutingDuApiType> {
    const params = new UrlParams({ cdnId: cdnId }).stringified;
    const path = combineUrl(BACKEND_URL, "ds-routing/rules/delivery-unit", params);

    const data = await Ajax.getJson(path, metadata);
    return data as RoutingDuApiType;
  }

  async createRoutingRuleDu(routingRule: Omit<DeliveryUnitRuleApiType & ApiRuleRouting, "ruleId">) {
    const path = combineUrl(BACKEND_URL, "ds-routing/rules/delivery-unit/");

    await Ajax.postJson(path, routingRule);
  }

  async updateRoutingRuleDu(routingRule: DeliveryUnitRuleApiType & ApiRuleRouting) {
    const path = combineUrl(BACKEND_URL, "ds-routing/rules/delivery-unit/", routingRule.ruleId);

    await Ajax.putJson(path, routingRule);
  }

  async deleteRoutingRuleDu(ruleId: string) {
    const path = combineUrl(BACKEND_URL, `ds-routing/rules/delivery-unit/`, ruleId);

    await Ajax.deleteJson(path);
  }
  //endregion

  //region [[DS Routing Rules - Network]]
  async getRoutingRulesNetwork(cdnId: string, metadata: AjaxMetadata): Promise<RoutingNetworkApiType> {
    const params = new UrlParams({ cdnId: cdnId }).stringified;
    const path = combineUrl(BACKEND_URL, "ds-routing/rules/network", params);

    const data = await Ajax.getJson(path, metadata);
    return data as RoutingNetworkApiType;
  }

  async createRoutingRuleNetwork(routingRule: Omit<NetworkRuleApiType & ApiRuleRouting, "ruleId">) {
    const path = combineUrl(BACKEND_URL, "ds-routing/rules/network/");

    await Ajax.postJson(path, routingRule);
  }

  async updateRoutingRuleNetwork(routingRule: NetworkRuleApiType & ApiRuleRouting) {
    const path = combineUrl(BACKEND_URL, "ds-routing/rules/network/", routingRule.ruleId);

    await Ajax.putJson(path, routingRule);
  }

  async deleteRoutingRuleNetwork(ruleId: string) {
    const path = combineUrl(BACKEND_URL, `ds-routing/rules/network/`, ruleId);

    await Ajax.deleteJson(path);
  }
  //endregion

  //region [[ Singleton ]]
  protected static _instance: DsAssignmentsApi | undefined;
  static get instance(): DsAssignmentsApi {
    if (!this._instance) {
      const realApi = new DsAssignmentsApi();
      const mockApi = MockWrapperProxy.wrap(realApi, DsAssignmentsApiMock.instance);
      this._instance = !devToolsStore.isMockMode ? realApi : mockApi;
    }

    return this._instance;
  }
  //endregion
}
