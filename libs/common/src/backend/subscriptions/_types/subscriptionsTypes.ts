export type SubscriptionsApiResult = SubscriptionApiType[];
export interface SubscriptionApiCriteria {
  systemIds?: string[]; // List of systemIds for which the user would like to receive alerts.
  components?: string[]; // List of components. Used only for system-events qcAPI
}
export interface SubscriptionsApiTypePayload {
  subscriptionName: string;
  criteria: SubscriptionApiCriteria;
  destinationId?: string;
}
export interface SubscriptionApiType {
  subscriptionId: string;
  ownerOrgId: string;
  subscription: SubscriptionsApiTypePayload;
}
export interface DestinationApiTypePayload {
  destinationName: string;
  pushMethod: "HTTP";
  httpProtocolParams: {
    maxRetries: number;
    backoffFactorSeconds: number;
    readTimeoutSeconds: number;
    connectTimeoutSeconds: number;
    endpointUrl: string;
    method: HTTPMethodEnum;
    authentication: {
      type: AuthTypeEnum;
      basicAuthentication: {
        username: string;
        password: string;
      };
    };
  };
}
export interface DestinationApiType {
  destinationId: string;
  ownerOrgId: string;
  destination: DestinationApiTypePayload;
}

export enum HTTPMethodEnum {
  POST = "POST",
  PUT = "PUT",
}

export enum AuthTypeEnum {
  BASIC = "BASIC",
}

export enum QcApiTypeEnum {
  NETWORK_STATUS = "network-status",
  SYSTEM_EVENTS = "system-events",
}
