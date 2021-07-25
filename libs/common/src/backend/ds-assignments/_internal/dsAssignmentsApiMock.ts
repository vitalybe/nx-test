/* eslint-disable unused-imports/no-unused-vars */
import { AjaxMetadata } from "../../../utils/ajax";
import { mockNetworkSleep, mockUtils } from "../../../utils/mockUtils";
import { DsAssignmentsApi } from "../../ds-assignments";
import { sleep } from "../../../utils/sleep";
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
} from "../_types/dsAssignmentsTypes";
import { Omit } from "../../../utils/typescriptUtils";
import mockData from "../../_utils/mockData";

export class DsAssignmentsApiMock implements DsAssignmentsApi {
  //region [[DS Assignment Rules]]
  async getAssignmentRules(cdnId: string, metadata: AjaxMetadata): Promise<AssignmentsApiType> {
    await sleep(mockNetworkSleep);

    return {
      rules: {
        network: [
          {
            ruleId: mockUtils.sequentialId().toString(),
            cdnId: cdnId,
            networkId: 1234,
            deliveryService: {
              id: "5dc81825791b35000113d234",
              label: "Global",
            },
            assignmentBlocked: false,
          },
        ],
        manifestRouter: [
          {
            ruleId: mockUtils.sequentialId().toString(),
            manifestRouterId: "manifestRouter1",
            cdnId: cdnId,
            assignmentBlocked: false,
            deliveryService: {
              id: "5dc81825791b35000113d234",
            },
          },
        ],
        deliveryUnit: mockData.deliveryUnitIds.map((deliveryUnitId, i) => ({
          ruleId: mockUtils.sequentialId().toString(),
          cdnId: cdnId,
          deliveryUnitId: deliveryUnitId,
          assignmentBlocked: false,
          routingEnabled: false,
          deliveryService: {
            id: "5dc81825791b35000113d234",
            label: mockData.dsRevisionLabels,
          },
        })),
      },
    };
  }

  async getAllAssignmentRules(metadata: AjaxMetadata): Promise<AssignmentsApiType> {
    await sleep(mockNetworkSleep);

    return {
      rules: {
        deliveryUnit: [
          {
            ruleId: "a830879f-9506-4132-9df0-83d4134b7ee0",
            cdnId: "cf6988d9-b341-412d-b978-99ccc407cf01",
            deliveryUnitId: "d6afd225-cb1c-4ea6-af82-1b2f4ba23b28",
            deliveryService: {
              id: "5e3c30469877620001b1b25e",
              label: "stable",
            },
            assignmentBlocked: false,
            enabled: true,
          },
          {
            ruleId: "e54d0d42-4db5-44ef-af20-68c7c9765e16",
            cdnId: "9e331b22-5d11-4067-9bf4-5f0992bd73fc",
            deliveryUnitId: "e7b272bb-797b-42b2-b402-c46eba4c2c91",
            deliveryService: {
              id: "5e4e592e2e016f0001046c31",
            },
            assignmentBlocked: true,
            enabled: true,
          },
          {
            ruleId: "f619a4a3-23a7-4662-bfa2-81839b1a7263",
            cdnId: "cf6988d9-b341-412d-b978-99ccc407cf01",
            deliveryUnitId: "38a9491a-38bf-4184-b323-eb103d51f048",
            deliveryService: {
              id: "5e4e592e2e016f0001046c31",
            },
            assignmentBlocked: true,
            enabled: true,
          },
        ],
        manifestRouter: [
          {
            ruleId: "be4daba0-1550-4058-8172-200cd4c7f312",
            cdnId: "9e331b22-5d11-4067-9bf4-5f0992bd73fc",
            manifestRouterId: "manifest-router-lb-0-euw1-green.opencaching",
            deliveryService: {
              id: "5e85a01a701bbf0001d99138",
            },
            assignmentBlocked: true,
            enabled: true,
          },
        ],
        network: [
          {
            ruleId: "807eea00-b6e6-41aa-93f0-30ef8f8f8767",
            cdnId: "9b2d89fe-7078-41e1-89c9-077f041ba480",
            networkId: 2750,
            deliveryService: {
              id: "5e3c30469877620001b1b25e",
              label: "shmulika-mutli-region",
            },
            assignmentBlocked: false,
            enabled: true,
          },
        ],
      },
    };
  }

  async deleteAssignmentRule(type: ApiEntityRuleType, ruleId: string) {
    await sleep(mockNetworkSleep);
  }

  async createAssignmentRuleCdn(assignmentRule: Omit<ApiRuleAssignment, "ruleId">) {
    await sleep(mockNetworkSleep);
  }

  async updateAssignmentRuleCdn(assignmentRule: ApiRuleAssignment) {
    await sleep(mockNetworkSleep);
  }

  async createAssignmentRuleNet(assignmentRule: Omit<ApiRuleAssignment & NetworkRuleApiType, "ruleId">) {
    await sleep(mockNetworkSleep);
  }

  async updateAssignmentRuleNet(assignmentRule: ApiRuleAssignment & NetworkRuleApiType) {
    await sleep(mockNetworkSleep);
  }

  async createAssignmentRuleDu(assignmentRule: Omit<ApiRuleAssignment & DeliveryUnitRuleApiType, "ruleId">) {
    await sleep(mockNetworkSleep);
  }

  async updateAssignmentRuleDu(assignmentRule: ApiRuleAssignment & DeliveryUnitRuleApiType) {
    await sleep(mockNetworkSleep);
  }

  async createAssignmentRuleMr(assignmentRule: Omit<ApiRuleAssignment & ManifestRouterRuleApiType, "ruleId">) {
    await sleep(mockNetworkSleep);
  }

  async updateAssignmentRuleMr(assignmentRule: ApiRuleAssignment & ManifestRouterRuleApiType) {
    await sleep(mockNetworkSleep);
  }
  //endregion

  //region [[DS Routing Rules - DU]]
  async getRoutingRulesDu(cdnId: string, metadata: AjaxMetadata): Promise<RoutingDuApiType> {
    await sleep(mockNetworkSleep);

    return {
      deliveryUnit: [
        {
          ruleId: "34ed5dd1-0b11-42a5-a458-0e571479ef46",
          cdnId: "9b2d89fe-7078-41e1-89c9-077f041ba480",
          deliveryUnitId: "8211c8fb-31ed-439f-94df-0412b4e05cd7",
          deliveryServiceId: "5e3c30469877620001b1b25e",
          routingEnabled: false,
        },
      ],
    };
  }

  async createRoutingRuleDu(routingRule: Omit<DeliveryUnitRuleApiType & ApiRuleRouting, "ruleId">) {
    await sleep(mockNetworkSleep);
  }

  async updateRoutingRuleDu(routingRule: DeliveryUnitRuleApiType & ApiRuleRouting) {
    await sleep(mockNetworkSleep);
  }

  async deleteRoutingRuleDu(ruleId: string) {
    await sleep(mockNetworkSleep);
  }
  //endregion

  //region [[DS Routing Rules - Network]]
  async getRoutingRulesNetwork(cdnId: string, metadata: AjaxMetadata): Promise<RoutingNetworkApiType> {
    await sleep(mockNetworkSleep);

    return {
      network: [],
    };
  }

  async createRoutingRuleNetwork(routingRule: Omit<NetworkRuleApiType & ApiRuleRouting, "ruleId">) {
    await sleep(mockNetworkSleep);
  }

  async updateRoutingRuleNetwork(routingRule: NetworkRuleApiType & ApiRuleRouting) {
    await sleep(mockNetworkSleep);
  }

  async deleteRoutingRuleNetwork(ruleId: string) {
    await sleep(mockNetworkSleep);
  }
  //endregion

  //region [[ Singleton ]]
  protected static _instance: DsAssignmentsApiMock | undefined;
  static get instance(): DsAssignmentsApiMock {
    if (!this._instance) {
      this._instance = new DsAssignmentsApiMock();
    }

    return this._instance;
  }
  //endregion
}
