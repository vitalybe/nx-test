/* eslint-disable unused-imports/no-unused-vars */
import { AjaxMetadata } from "common/utils/ajax";
import { mockNetworkSleep } from "common/utils/mockUtils";
import { sleep } from "common/utils/sleep";
import { MonetizationConfigurationApi } from "common/backend/monetizationConfiguration";
import { loggerCreator } from "common/utils/logger";
import { ApiCpContractType, ApiSpContractType } from "../_types/monetizationConfigurationTypes";
import { DateTime, Duration } from "luxon";
import { CurrencyUnitEnum } from "common/components/_projectSpecific/monetization/_utils/currencyUtils";

const cpContractJsonMock = require("common/backend/monetizationConfiguration/_mocks/cp-contract-mock.json");
// noinspection JSUnusedLocalSymbols
const moduleLogger = loggerCreator(__filename);

export class MonetizationConfigurationApiMock implements MonetizationConfigurationApi {
  async ispContracts(metadata: AjaxMetadata): Promise<ApiSpContractType[]> {
    await sleep(mockNetworkSleep);

    return [
      {
        contractId: "1",
        sp: "qwilt",
        contractName: "contractName",
        capacityMbps: 10_000_000_000_000,
        startDate: DateTime.local().toSeconds(), // epoch seconds
        duration: Duration.fromObject({ years: 5 }).as("days"), // days count
        financingAmount: 1_200_000,
        currency: CurrencyUnitEnum.US_DOLLAR,
        hideExpectedFinancingEndDate: false,
        operationalMode: "active",
        phases: [
          {
            startDate: DateTime.local().toSeconds(),
            type: "financing",
            estimatedEndDate: DateTime.local().toSeconds(),
            revenueSharingPercent: 10,
          },
          {
            type: "revenueStream",
            revenueSharingPercent: 10,
          },
        ],
      },
    ];
  }
  async createIspContract(data: ApiSpContractType) {
    await sleep(mockNetworkSleep);
    moduleLogger.debug(JSON.stringify(data));
  }

  async deleteIspContract(id: string): Promise<void> {
    await sleep(mockNetworkSleep);
    moduleLogger.debug("DELETE: " + id);
  }

  async editIspContract(id: string, data: Omit<ApiSpContractType, "contractId">) {
    await sleep(mockNetworkSleep);
    moduleLogger.debug("EDIT: " + id, data);
  }

  async cpContracts(metadata: AjaxMetadata): Promise<ApiCpContractType[]> {
    await sleep(mockNetworkSleep);
    return cpContractJsonMock;
  }

  async createCpContract(data: Omit<ApiCpContractType, "contractId">) {
    await sleep(mockNetworkSleep);
    moduleLogger.debug(JSON.stringify(data));
  }

  async deleteCpContract(id: string): Promise<void> {
    await sleep(mockNetworkSleep);
    moduleLogger.debug("DELETE: " + id);
  }

  async editCpContract(id: string, data: Omit<ApiCpContractType, "contractId">) {
    await sleep(mockNetworkSleep);
    moduleLogger.debug("EDIT: " + id, data);
  }

  //region [[ Singleton ]]
  protected static _instance: MonetizationConfigurationApiMock | undefined;
  static get instance(): MonetizationConfigurationApiMock {
    if (!this._instance) {
      this._instance = new MonetizationConfigurationApiMock();
    }

    return this._instance;
  }
  //endregion
}

//region [[ Mock config types ]]
interface MonetizationConfigurationApiMockConfig {
  sampleText: string;
}
//endregion
