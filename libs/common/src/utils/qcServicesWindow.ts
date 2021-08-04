import { MockNetworkRequestEntity } from "common/backend/_utils/mockWrapperProxy/mockNetworkRequestEntity";

export interface QcServicesWindow {
  Cypress: object | undefined;
  cypressMockFinished: boolean;

  mockedNetworkRequests: MockNetworkRequestEntity[];
  mockedNetworkResponses: MockNetworkRequestEntity[];
}

export function getQcServicesWindow() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (window as any) as QcServicesWindow;
}
