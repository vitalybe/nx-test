import { loggerCreator } from "common/utils/logger";
import { getOriginForApi } from "common/backend/backendOrigin";
import { combineUrl } from "common/utils/combineUrl";
import { UrlParams } from "common/backend/_utils/urlParams";
import { Ajax, AjaxMetadata } from "common/utils/ajax";
import { devToolsStore } from "common/components/devTools/_stores/devToolsStore";
import { MonetizationReportsApiMock } from "common/backend/monetizationReports";
import { MockWrapperProxy } from "common/backend/_utils/mockWrapperProxy/mockWrapperProxy";
import {
  ApiCpPaymentPayloadType,
  ApiCpPaymentType,
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
import { DateTime } from "luxon";

const moduleLogger = loggerCreator(__filename);
const BACKEND_URL = combineUrl(getOriginForApi("monetization-reports"), "/api/1/");

export class MonetizationReportsApi {
  protected constructor() {}

  //region [[ DA Report ]]
  async overtimeDa(
    metadata: AjaxMetadata,
    { fromMonth, toMonth }: { fromMonth: string | undefined; toMonth: string | undefined },
    sps?: string[],
    projects?: string[]
  ): Promise<MonetizationApiDaOvertimeResponse> {
    const params = new UrlParams({});
    // projects is a stronger filter, it will return the SPs of the requested projects
    if (fromMonth) {
      params.set({ fromMonth });
    }
    if (toMonth) {
      params.set({ toMonth });
    }
    if (projects) {
      params.set({ projects });
    } else if (sps) {
      // this will return all projects per requested SP
      params.set({ sps });
    }
    const path = combineUrl(BACKEND_URL, "reports/da/overtime", params.stringified);

    const data = await Ajax.getJson(path, metadata);
    return data as MonetizationApiDaOvertimeResponse;
  }

  async peaksDa(
    metadata: AjaxMetadata,
    month: string,
    sps?: string[],
    projects?: string[]
  ): Promise<MonetizationApiDaPeaksResponse> {
    const params = new UrlParams({ month });
    // projects is a stronger filter, it will return the SPs of the requested projects
    if (projects) {
      params.set({ projects });
    } else if (sps) {
      // this will return all projects per requested SP
      params.set({ sps });
    }
    const path = combineUrl(BACKEND_URL, "reports/da/peak", params.stringified);

    const data = await Ajax.getJson(path, metadata);
    return data as MonetizationApiDaPeaksResponse;
  }

  async projectsDa(
    metadata: AjaxMetadata,
    toMonth: string,
    sps?: string[],
    projects?: string[]
  ): Promise<MonetizationApiDaProjectsResponse> {
    const params = new UrlParams({ toMonth });
    if (projects) {
      // projects is a stronger filter, it will return the SPs of the requested projects
      params.set({ projects });
    } else if (sps) {
      // this will return all projects per requested SP
      params.set({ sps });
    }
    const path = combineUrl(BACKEND_URL, "reports/da/projects", params.stringified);
    const data = await Ajax.getJson(path, metadata);
    return data as MonetizationApiDaProjectsResponse;
  }

  async paymentsDa(metadata: AjaxMetadata): Promise<MonetizationApiDaPaymentsResponse> {
    const path = combineUrl(BACKEND_URL, "reports/da/payments");

    const data = await Ajax.getJson(path, metadata);
    return data as MonetizationApiDaPaymentsResponse;
  }

  async setDaPaymentInvoiceSent(paymentId: string, date: DateTime): Promise<unknown> {
    const path = combineUrl(BACKEND_URL, "reports/da/payments/invoice-sent");
    const payload = {
      invoiceSentDateEpoch: date.toSeconds(),
      paymentId,
    };
    return await Ajax.postJson(path, payload);
  }

  //endregion

  //region [[ CP Report ]]
  async overtimeCp(metadata: AjaxMetadata, cp: string, sps?: string[]): Promise<MonetizationApiCpOvertimeResponse> {
    const params = new UrlParams({ cp });
    if (sps) {
      params.set({ sps });
    }
    const path = combineUrl(BACKEND_URL, "reports/cp/overtime", params.stringified);

    const data = await Ajax.getJson(path, metadata);
    return data as MonetizationApiCpOvertimeResponse;
  }

  async monthlyCp(
    metadata: AjaxMetadata,
    cp: string,
    toMonth: string,
    sps?: string[]
  ): Promise<MonetizationApiCpMonthlyResponse> {
    const params = new UrlParams({ cp, toMonth });
    if (sps) {
      params.set({ sps });
    }
    const path = combineUrl(BACKEND_URL, "reports/cp/monthly", params.stringified);

    const data = await Ajax.getJson(path, metadata);
    return data as MonetizationApiCpMonthlyResponse;
  }

  async paymentsCp(metadata: AjaxMetadata, cp: string): Promise<MonetizationApiCpPaymentsResponse> {
    const params = new UrlParams({ cp }).stringified;
    const path = combineUrl(BACKEND_URL, "reports/cp/payments", params);

    const data = await Ajax.getJson(path, metadata);
    return data as MonetizationApiCpPaymentsResponse;
  }

  async peaksCp(
    metadata: AjaxMetadata,
    cp: string,
    month: string,
    sps?: string[],
    serviceTypes?: string[]
  ): Promise<MonetizationApiCpPeaksResponse> {
    const params = new UrlParams({ cp, month });
    if (sps) {
      params.set({ sps });
    }
    if (serviceTypes) {
      params.set({ serviceTypes });
    }
    const path = combineUrl(BACKEND_URL, "reports/cp/peak", params.stringified);

    const data = await Ajax.getJson(path, metadata);
    return data as MonetizationApiCpPeaksResponse;
  }

  //endregion

  // region [[ SP Report ]]
  async overtimeSp(metadata: AjaxMetadata, sp: string, cps?: string[]): Promise<MonetizationApiSpOvertimeResponse> {
    const params = new UrlParams({ sp });
    if (cps) {
      params.set({ cps });
    }
    const path = combineUrl(BACKEND_URL, "reports/isp/overtime", params.stringified);

    const data = await Ajax.getJson(path, metadata);
    return data as MonetizationApiSpOvertimeResponse;
  }
  async peaksSp(
    metadata: AjaxMetadata,
    sp: string,
    month: string,
    cps?: string[]
  ): Promise<MonetizationApiSpPeaksResponse> {
    const params = new UrlParams({ sp, month });
    if (cps) {
      params.set({ cps });
    }
    const path = combineUrl(BACKEND_URL, "reports/isp/peak", params.stringified);

    const data = await Ajax.getJson(path, metadata);
    return data as MonetizationApiSpPeaksResponse;
  }

  async monthlySp(metadata: AjaxMetadata, sp: string, toMonth: string): Promise<MonetizationApiSpMonthlyResponse> {
    const params = new UrlParams({ sp, toMonth }).stringified;
    const path = combineUrl(BACKEND_URL, "reports/isp/monthly", params);

    const data = await Ajax.getJson(path, metadata);
    return data as MonetizationApiSpMonthlyResponse;
  }

  async projectsSp(metadata: AjaxMetadata, sp: string): Promise<MonetizationApiProjectsResponse> {
    const params = new UrlParams({ sp }).stringified;
    const path = combineUrl(BACKEND_URL, "reports/isp/projects", params);

    const data = await Ajax.getJson(path, metadata);
    return data as MonetizationApiProjectsResponse;
  }

  async paymentsSp(metadata: AjaxMetadata, sp: string): Promise<MonetizationApiSpPaymentsResponse> {
    const params = new UrlParams({ sp }).stringified;
    const path = combineUrl(BACKEND_URL, "reports/isp/payments", params);

    const data = await Ajax.getJson(path, metadata);
    return data as MonetizationApiSpPaymentsResponse;
  }

  async setSpPaymentInvoiceSent(sp: string, paymentId: string, date: DateTime): Promise<unknown> {
    const params = new UrlParams({ sp }).stringified;
    const path = combineUrl(BACKEND_URL, "reports/isp/payments/invoice-sent", params);
    const payload = {
      invoiceSentDateEpoch: date.toSeconds(),
      paymentId,
    };
    return await Ajax.postJson(path, payload);
  }
  // endregion

  // region [[ Internal Configuration ]]
  async ispPayments(metadata: AjaxMetadata): Promise<ApiIspPaymentType[]> {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, "payments/isp/", params);

    const data = await Ajax.getJson(path, metadata);
    return data as ApiIspPaymentType[];
  }

  async cpPayments(metadata: AjaxMetadata): Promise<ApiCpPaymentType[]> {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, "payments/cp/", params);

    const data = await Ajax.getJson(path, metadata);
    return data as ApiCpPaymentType[];
  }

  async updateIspPayment(payload: ApiIspPaymentPayloadType): Promise<unknown> {
    const params = new UrlParams({ paymentId: payload.paymentId }).stringified;
    const path = combineUrl(BACKEND_URL, "payments/isp/", params);

    return await Ajax.putJson(path, payload);
  }

  async updateCpPayment(payload: ApiCpPaymentPayloadType): Promise<unknown> {
    const params = new UrlParams({ paymentId: payload.paymentId }).stringified;
    const path = combineUrl(BACKEND_URL, "payments/cp/", params);

    return await Ajax.putJson(path, payload);
  }

  //endregion

  //region [[ Singleton ]]
  protected static _instance: MonetizationReportsApi | undefined;
  static get instance(): MonetizationReportsApi {
    if (!this._instance) {
      const realApi = new MonetizationReportsApi();
      const mockApi = MockWrapperProxy.wrap(realApi, MonetizationReportsApiMock.instance);
      this._instance = !devToolsStore.isMockMode ? realApi : mockApi;
    }

    return this._instance;
  }
  //endregion
}
