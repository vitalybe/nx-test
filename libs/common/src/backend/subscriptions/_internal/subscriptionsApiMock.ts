/* eslint-disable unused-imports/no-unused-vars */
import { mockNetworkSleep, mockUtils } from "../../../utils/mockUtils";
import { sleep } from "../../../utils/sleep";
import { SubscriptionsApi } from "../../subscriptions";
import {
  DestinationApiType,
  DestinationApiTypePayload,
  QcApiTypeEnum,
  SubscriptionsApiResult,
  SubscriptionsApiTypePayload,
} from "../_types/subscriptionsTypes";
import { loggerCreator } from "../../../utils/logger";
import _ from "lodash";
import { AuthTypeEnum, HTTPMethodEnum } from "../_types/subscriptionsTypes";

const moduleLogger = loggerCreator("__filename");

export class SubscriptionsApiMock implements SubscriptionsApi {
  async list(): Promise<SubscriptionsApiResult> {
    await sleep(mockNetworkSleep);

    return _.range(8).map((i) => {
      return {
        subscriptionId: mockUtils.sequentialId().toString(),
        ownerOrgId: "verizon-fios",
        subscription: {
          subscriptionName: "Subscription " + i,
          destinationId: mockUtils.sequentialId().toString(),
          criteria: {},
        },
      };
    });
  }

  async destinationsList(): Promise<DestinationApiType[]> {
    return _.range(8).map((i) => ({
      destinationId: "9e331b22-5d11-4067-9bf4-5f0992bd73fc",
      ownerOrgId: "dev",
      destination: {
        destinationName: "my-destination",
        pushMethod: "HTTP",
        httpProtocolParams: {
          maxRetries: 5,
          backoffFactorSeconds: 5,
          readTimeoutSeconds: 5,
          connectTimeoutSeconds: 5,
          endpointUrl: "https://company.com/qwilt-alerts-receiver",
          method: HTTPMethodEnum.POST,
          authentication: {
            type: AuthTypeEnum.BASIC,
            basicAuthentication: {
              username: "joe@company.com",
              password: "*****",
            },
          },
        },
      },
    }));
  }

  async updateSubscription(id: string, orgId: string, qcApi: QcApiTypeEnum, payload: SubscriptionsApiTypePayload) {
    await sleep(mockNetworkSleep);
    moduleLogger.debug("Mock update, ID: " + id + " on behalf of org ID: " + orgId);
    moduleLogger.debug(JSON.stringify(payload));
  }

  async createSubscription(orgId: string, qcApi: QcApiTypeEnum, payload: SubscriptionsApiTypePayload) {
    await sleep(mockNetworkSleep);
    moduleLogger.debug("Mock create: ");
    moduleLogger.debug(JSON.stringify(payload));
  }

  async deleteSubscription(id: string) {
    await sleep(mockNetworkSleep);
    moduleLogger.debug("Mock delete: " + id);
  }
  async updateDestination(id: string, orgId: string, qcApi: QcApiTypeEnum, payload: DestinationApiTypePayload) {
    await sleep(mockNetworkSleep);
    moduleLogger.debug("Mock update, id: " + id);
    moduleLogger.debug(JSON.stringify(payload));
  }

  async createDestination(orgId: string, qcApi: QcApiTypeEnum, payload: DestinationApiTypePayload) {
    await sleep(mockNetworkSleep);
    moduleLogger.debug("Mock create: ");
    moduleLogger.debug(JSON.stringify(payload));
  }

  async deleteDestination(id: string) {
    await sleep(mockNetworkSleep);
    moduleLogger.debug("Mock delete: " + id);
  }

  //region [[ Singleton ]]
  protected static _instance: SubscriptionsApiMock | undefined;
  static get instance(): SubscriptionsApiMock {
    if (!this._instance) {
      this._instance = new SubscriptionsApiMock();
    }

    return this._instance;
  }
  //endregion
}

//region [[ Mock config types ]]
interface SubscriptionsApiMockConfig {
  sampleText: string;
}
//endregion
