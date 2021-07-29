/* eslint-disable unused-imports/no-unused-vars */
import { MockNetworkRequestEntity } from "common/backend/_utils/mockWrapperProxy/mockNetworkRequestEntity";
import { loggerCreator } from "common/utils/logger";
import * as _ from "lodash";
import { getQcServicesWindow } from "common/utils/qcServicesWindow";
import { Mutex } from "await-semaphore";

//noinspection JSUnusedLocalSymbols
const moduleLogger = loggerCreator(__filename);

const mockedNetworkRequests = [] as MockNetworkRequestEntity[];
const mockedNetworkResponses = [] as MockNetworkRequestEntity[];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
getQcServicesWindow().mockedNetworkRequests = mockedNetworkRequests;
getQcServicesWindow().mockedNetworkResponses = mockedNetworkResponses;

interface ValidateRequestFindBy {
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  partialHostname: string;
}

export class MockWrapperProxy {
  static findRequests(
    mockRequests: MockNetworkRequestEntity[],
    findBy: ValidateRequestFindBy
  ): MockNetworkRequestEntity[] {
    const foundRequests = mockRequests.filter((request) => {
      const url = new URL(request.url);
      const methodEquals = request.method?.toUpperCase() === findBy.method.toUpperCase();
      const hostnameIncludes = url.hostname.toLowerCase().includes(findBy.partialHostname.toLowerCase());
      const pathEquals = _.trim(url.pathname.toLowerCase(), "/") === _.trim(findBy.path.toLowerCase(), "/");
      return methodEquals && hostnameIncludes && pathEquals;
    });

    return foundRequests;
  }

  private static _wrapMutex = new Mutex();

  // This wrapper proxy does the following:
  // * Mocks the "fetch" function to prevent real API calls
  // * Call the original API to get the HTTP request that would happen
  // * Call the mock API to get the mocked responses
  // * If mock API override is available (e.g from e2e test, use that instead)
  static wrap<T extends object>(realApi: T, mockApi: T) {
    return new Proxy(mockApi, {
      get: function (target, key) {
        return async (...args: unknown[]) => {
          const release = await MockWrapperProxy._wrapMutex.acquire();
          const fetchBackup = window.fetch;
          try {
            let mockResult: unknown = undefined;

            window.fetch = (async (url: string, options: RequestInit) => {
              const mockUrl = {
                url: url,
                method: options.method,
                body: JSON.parse(options.body?.toString() ?? "null"),
              };
              moduleLogger.debug("mocked network request", mockUrl);
              mockedNetworkRequests.push(mockUrl);

              const mockApiResponseOverride = MockWrapperProxy.getMockedResponse(options.method ?? "GET", url);
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const mockApiResponse = await (mockApi as any)[key](...args);
              mockResult = mockApiResponseOverride || mockApiResponse;
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
            }) as any;

            try {
              // eslint-disable-next-line
              await (realApi as any)[key](...args);
            } catch (e) {
              // We don't care about the real API - we just want to get its fetch parameters
            }
            return mockResult;
          } finally {
            window.fetch = fetchBackup;
            release();
          }
        };
      },
    });
  }

  private static getMockedResponse(method: string, url: string) {
    const urlObject = new URL(url);
    const response = MockWrapperProxy.findRequests(mockedNetworkResponses, {
      partialHostname: urlObject.hostname,
      method: method as "GET" | "POST" | "PUT" | "DELETE",
      path: urlObject.pathname,
    });

    return response[0]?.body;
  }
}
