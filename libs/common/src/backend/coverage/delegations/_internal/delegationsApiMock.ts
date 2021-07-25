/* eslint-disable */
import { AjaxMetadata } from "common/utils/ajax";
import { sleep } from "common/utils/sleep";
import { DelegationsApi } from "common/backend/coverage/delegations";
import { DltsApiResult } from "common/backend/coverage/delegations/_types/dltTypes";
import { loggerCreator } from "common/utils/logger";
import {
  RouterSelectionRuleApiEditType,
  RouterSelectionRulesApiResult,
} from "common/backend/coverage/delegations/_types/routerSelectionRulesTypes";
import {
  DelegationApiEditType,
  DelegationApiType,
  DelegationsApiResult,
  FootprintTypeEnum,
} from "common/backend/coverage/delegations/_types/delegationTypes";
import {
  DelegationSelectionApiEditType,
  DelegationSelectionApiType,
  DelegationSelectionsApiResult,
} from "common/backend/coverage/delegations/_types/delegationSelectionTypes";
import mockData from "common/backend/_utils/mockData";
import { mockNetworkSleep } from "common/utils/mockUtils";

const moduleLogger = loggerCreator(__filename);

export class DelegationsApiMock extends DelegationsApi {
  async listDlts(metadata: AjaxMetadata): Promise<DltsApiResult> {
    await sleep(mockNetworkSleep);

    return {
      dlts: {
        [mockData.dltId[0]]: {
          id: mockData.dltId[0],
          dltName: "ap-pk",
          hostToken: "ap-pk",
        },
        [mockData.dltId[1]]: {
          id: mockData.dltId[1],
          dltName: "eu-central",
          hostToken: "eu-central",
        },
      },
    };
  }

  async createDlt() {
    await sleep(mockNetworkSleep);
  }

  async deleteDlt() {
    await sleep(mockNetworkSleep);
  }

  async listRouterSelectionRules(metadata: AjaxMetadata): Promise<RouterSelectionRulesApiResult> {
    return {
      rules: {
        "rule-1": {
          id: "rule-1",
          asn: null,
          ispId: mockData.ispId[0],
          footprintElementId: null,
          delegationLocationTargetId: mockData.dltId[0],
        },
        "rule-2": {
          id: "rule-2",
          asn: null,
          ispId: null,
          footprintElementId: mockData.footprintId[0],
          delegationLocationTargetId: mockData.dltId[0],
        },
        "rule-3": {
          id: "rule-3",
          asn: 1,
          ispId: null,
          footprintElementId: null,
          delegationLocationTargetId: mockData.dltId[0],
        },
      },
    };
  }

  async createRouterSelectionRules(entity: RouterSelectionRuleApiEditType) {
    await sleep(mockNetworkSleep);
  }

  async deleteRouterSelectionRules(id: string) {
    await sleep(mockNetworkSleep);
  }

  async listDelegations(metadata: AjaxMetadata): Promise<DelegationsApiResult> {
    return {
      delegations: {
        "delegation-1": {
          id: "delegation-1",
          footprintServiceName: mockData.footprintServiceName[0],
          ispId: mockData.ispId[0],
          serviceToken: "serviceToken-1",
          cpEndpoint: "cpEndpoint-1",
          footprintType: FootprintTypeEnum.SUBNET,
        },
        "delegation-2": {
          id: "delegation-2",
          footprintServiceName: mockData.footprintServiceName[1],
          ispId: mockData.ispId[1],
          serviceToken: "serviceToken-2",
          cpEndpoint: "cpEndpoint-2",
          footprintType: FootprintTypeEnum.ASN,
        },
      },
    };
  }

  async createDelegations(entity: DelegationApiEditType) {
    await sleep(mockNetworkSleep);
  }

  async updateDelegations(entity: DelegationApiType) {
    await sleep(mockNetworkSleep);
  }

  async deleteDelegations(id: string) {
    await sleep(mockNetworkSleep);
  }

  async listDelegationSelections(metadata: AjaxMetadata): Promise<DelegationSelectionsApiResult> {
    return {
      rules: {
        "delegation-selection-1": {
          id: "delegation-selection-1",
          serviceName: mockData.footprintServiceName[0],
          ispId: mockData.ispId[0],
          enabled: true,
          selectionType: "Full",
        },
        "delegation-selection-2": {
          id: "delegation-selection-2",
          serviceName: mockData.footprintServiceName[1],
          ispId: mockData.ispId[1],
          enabled: true,
          selectionType: "Full",
        },
        "delegation-selection-3": {
          id: "delegation-selection-3",
          serviceName: mockData.footprintServiceName[1],
          ispId: mockData.ispId[1],
          enabled: true,
          selectionType: "ByPercentage",
          byPercentageParams: { percent: 30 },
        },
        "delegation-selection-4": {
          id: "delegation-selection-4",
          serviceName: mockData.footprintServiceName[1],
          ispId: mockData.ispId[1],
          enabled: true,
          selectionType: "Selective",
          selectionRules: [
            { footprintElementId: mockData.footprintId[0] },
            { footprintElementId: mockData.footprintId[1], firstXIps: 30 },
          ],
        },
      },
    };
  }

  async createDelegationSelections(entity: DelegationSelectionApiEditType) {
    await sleep(mockNetworkSleep);
  }

  async updateDelegationSelections(entity: DelegationSelectionApiType) {
    await sleep(mockNetworkSleep);
  }

  async deleteDelegationSelections(id: string) {
    await sleep(mockNetworkSleep);
  }

  //region [[ Singleton ]]
  protected static _instance: DelegationsApiMock | undefined;
  static get instance(): DelegationsApiMock {
    if (!this._instance) {
      this._instance = new DelegationsApiMock();
    }

    return this._instance;
  }
  //endregion
}
