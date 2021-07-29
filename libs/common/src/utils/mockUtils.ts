import { sleep } from "common/utils/sleep";
import { loggerCreator } from "common/utils/logger";
import { CommonUrlParams } from "common/urlParams/commonUrlParams";

const murmur = require("murmurhash-js");
const uuidv1 = require("uuid/v1");

//noinspection JSUnusedLocalSymbols
const moduleLogger = loggerCreator(__filename);

const DEFAULT_MOCK_SLEEP_TIME = 100;
const mockSleepTimeParam = new URLSearchParams(location.search).get(CommonUrlParams.mockSleepTime);
export const mockNetworkSleep: number = mockSleepTimeParam
  ? Number.parseInt(mockSleepTimeParam)
  : DEFAULT_MOCK_SLEEP_TIME;

class MockUtils {
  createMockObject<T>(data: { [name in keyof T]: T[name] }): T {
    return data as T;
  }

  randomGuid = () => {
    return uuidv1();
  };

  lastId = 0;
  sequentialId = () => {
    return this.lastId++;
  };

  randomConsistent = (seed: string, max: number) => {
    return murmur(seed) % max;
  };

  randomMetricValue = (seed: string) => {
    const hash = murmur(seed) % 100000;
    return Math.round(hash * Math.pow(7, 10));
  };

  mockAction(action: string) {
    return () => {
      moduleLogger.info("Mock action: " + action);
    };
  }

  mockAsyncAction(action: string) {
    return () => {
      moduleLogger.info("Mock action: " + action);

      return Promise.resolve();
    };
  }

  getNoopResolveProxy<T>(realApi: T) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return new Proxy(realApi as any, {
      get: function() {
        return () => {
          sleep(mockNetworkSleep);
          return Promise.resolve();
        };
      },
    });
  }
}

export const mockUtils = new MockUtils();
