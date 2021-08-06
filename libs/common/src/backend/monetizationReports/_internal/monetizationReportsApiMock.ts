/* eslint-disable unused-imports/no-unused-vars */
import { AjaxMetadata } from "../../../utils/ajax";
import { mockNetworkSleep } from "../../../utils/mockUtils";
import { sleep } from "../../../utils/sleep";
import { MonetizationReportsApi } from "../../monetizationReports";
import {
  ApiCpPaymentPayloadType,
  ApiCpPaymentType,
  ApiDaPaymentType,
  ApiIspPaymentPayloadType,
  ApiIspPaymentType,
  MonetizationApiCpMonthlyResponse,
  MonetizationApiCpOvertimeResponse,
  MonetizationApiCpPaymentsResponse,
  MonetizationApiCpPeaksResponse,
  MonetizationApiDaOvertimeResponse,
  MonetizationApiDaPaymentsResponse,
  MonetizationApiDaPeaksResponse,
  MonetizationApiDaProjectsResponse,
  MonetizationApiProjectsResponse,
  MonetizationApiSpMonthlyResponse,
  MonetizationApiSpOvertimeResponse,
  MonetizationApiSpPaymentsResponse,
  MonetizationApiSpPeaksResponse,
} from "../_types/monetizationReportsTypes";
import { loggerCreator } from "../../../utils/logger";
import { DateTime } from "luxon";

const moduleLogger = loggerCreator("__filename");
const overtimeReportCpMock: MonetizationApiCpOvertimeResponse = require("../_mocks/monetization-reports-cp-overtime.json");
const monthlyReportCpMock: MonetizationApiCpMonthlyResponse = require("../_mocks/monetization-reports-cp-monthly.json");
const overtimeReportSpMock: MonetizationApiSpOvertimeResponse = require("../_mocks/monetization-reports-sp-overtime.json");
const overtimeReportDaMock: MonetizationApiDaOvertimeResponse = require("../_mocks/monetization-reports-da-overtime.json");
const peaksReportDaMock: (MonetizationApiDaPeaksResponse & {
  month: string;
})[] = require("../_mocks/monetization-reports-da-peaks.json");
const projectsReportDaMock: MonetizationApiDaProjectsResponse = require("../_mocks/monetization-reports-da-projects.json");
const peaksReportSpMock: (MonetizationApiSpPeaksResponse & {
  month: string;
})[] = require("../_mocks/monetization-reports-sp-peaks.json");
const peaksReportCpMock: (MonetizationApiCpPeaksResponse & {
  month: string;
})[] = require("../_mocks/monetization-reports-cp-peaks.json");
const monthlyReportSpMock: MonetizationApiSpMonthlyResponse = require("../_mocks/monetization-reports-sp-monthly.json");
const projectReportSpMock: MonetizationApiProjectsResponse = require("../_mocks/monetization-reports-sp-projects.json");
const paymentsSpMock: MonetizationApiSpPaymentsResponse = require("../_mocks/monetization-reports-api-sp-payments.json");
const ispPaymentsMock: ApiIspPaymentType[] = require("../_mocks/monetization-reports-isp-payments.json");
const cpPaymentsMock: ApiCpPaymentType[] = require("../_mocks/monetization-reports-cp-payments.json");
const daPaymentsMock: ApiDaPaymentType[] = require("../_mocks/monetization-reports-da-payments.json");

export class MonetizationReportsApiMock implements MonetizationReportsApi {
  async overtimeDa(
    metadata: AjaxMetadata,
    timeFrame: { fromMonth: string | undefined; toMonth: string | undefined },
    sps?: string[],
    projects?: string[]
  ): Promise<MonetizationApiDaOvertimeResponse> {
    await sleep(mockNetworkSleep);
    moduleLogger.debug("Overtime DA MOCK: ", overtimeReportDaMock);
    return overtimeReportDaMock as MonetizationApiDaOvertimeResponse;
  }

  async projectsDa(metadata: AjaxMetadata): Promise<MonetizationApiDaProjectsResponse> {
    await sleep(mockNetworkSleep);
    return projectsReportDaMock;
  }

  async paymentsDa(metadata: AjaxMetadata): Promise<MonetizationApiDaPaymentsResponse> {
    await sleep(mockNetworkSleep);
    return {
      payments: daPaymentsMock,
    };
  }

  async peaksDa(metadata: AjaxMetadata, month: string, sps?: string[]): Promise<MonetizationApiDaPeaksResponse> {
    await sleep(mockNetworkSleep);
    return (
      peaksReportDaMock.find((sample) => sample.month === month) ?? peaksReportDaMock[peaksReportDaMock.length - 1]
    );
  }

  async monthlyCp(metadata: AjaxMetadata, cp: string, toMonth: string): Promise<MonetizationApiCpMonthlyResponse> {
    await sleep(mockNetworkSleep);
    moduleLogger.debug("Monthly Cp MOCK: ", monthlyReportCpMock);
    return monthlyReportCpMock as MonetizationApiCpMonthlyResponse;
  }

  async overtimeCp(metadata: AjaxMetadata, cp: string, sps?: string[]): Promise<MonetizationApiCpOvertimeResponse> {
    await sleep(mockNetworkSleep);
    moduleLogger.debug("Overtime Cp MOCK: ", overtimeReportCpMock);
    return overtimeReportCpMock as MonetizationApiCpOvertimeResponse;
  }

  async peaksCp(
    metadata: AjaxMetadata,
    cp: string,
    month: string,
    sps?: string[]
  ): Promise<MonetizationApiCpPeaksResponse> {
    await sleep(mockNetworkSleep);
    return (
      peaksReportCpMock.find((sample) => sample.month === month) ?? peaksReportCpMock[peaksReportCpMock.length - 1]
    );
  }

  async paymentsCp(metadata: AjaxMetadata, cp: string): Promise<MonetizationApiCpPaymentsResponse> {
    await sleep(mockNetworkSleep);
    moduleLogger.debug("Payments Cp MOCK: ", cpPaymentsMock);
    return {
      payments: cpPaymentsMock,
    } as MonetizationApiCpPaymentsResponse;
  }

  async overtimeSp(metadata: AjaxMetadata, sp: string, cps?: string[]): Promise<MonetizationApiSpOvertimeResponse> {
    await sleep(mockNetworkSleep);
    return overtimeReportSpMock;
  }
  async peaksSp(
    metadata: AjaxMetadata,
    sp: string,
    month: string,
    cps?: string[]
  ): Promise<MonetizationApiSpPeaksResponse> {
    await sleep(mockNetworkSleep);
    return (
      peaksReportSpMock.find((sample) => sample.month === month) ?? peaksReportSpMock[peaksReportSpMock.length - 1]
    );
  }
  async monthlySp(metadata: AjaxMetadata, sp: string, month: string): Promise<MonetizationApiSpMonthlyResponse> {
    await sleep(mockNetworkSleep);
    return MonetizationReportsApiMock.getMonthlyReportForMonth(month);
  }

  async projectsSp(metadata: AjaxMetadata, sp: string): Promise<MonetizationApiProjectsResponse> {
    await sleep(mockNetworkSleep);
    return projectReportSpMock;
  }

  async paymentsSp(metadata: AjaxMetadata, sp: string): Promise<MonetizationApiSpPaymentsResponse> {
    await sleep(mockNetworkSleep);
    return paymentsSpMock;
  }
  async ispPayments(metadata: AjaxMetadata): Promise<ApiIspPaymentType[]> {
    await sleep(mockNetworkSleep);
    return ispPaymentsMock;
  }
  async cpPayments(metadata: AjaxMetadata): Promise<ApiCpPaymentType[]> {
    await sleep(mockNetworkSleep);
    return cpPaymentsMock;
  }

  private static getMonthlyReportForMonth(month: string): MonetizationApiSpMonthlyResponse {
    return {
      projects: [
        { ...monthlyReportSpMock.projects[0], reportId: "bt-" + month, cps: monthlyReportSpMock.projects[0].cps },
      ],
    };
  }

  async updateIspPayment(payload: ApiIspPaymentPayloadType) {
    await sleep(3000);
  }
  async updateCpPayment(payload: ApiCpPaymentPayloadType) {
    await sleep(3000);
  }
  async setSpPaymentInvoiceSent(sp: string, paymentId: string, date: DateTime) {
    await sleep(3000);
  }
  async setDaPaymentInvoiceSent(paymentId: string, date: DateTime) {
    await sleep(3000);
  }
  //region [[ Singleton ]]
  protected static _instance: MonetizationReportsApiMock | undefined;
  static get instance(): MonetizationReportsApiMock {
    if (!this._instance) {
      this._instance = new MonetizationReportsApiMock();
    }

    return this._instance;
  }
  //endregion
}
