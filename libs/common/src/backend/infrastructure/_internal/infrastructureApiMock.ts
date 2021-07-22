/* eslint-disable unused-imports/no-unused-vars */
import { AjaxMetadata } from "common/utils/ajax";
import { InfrastructureApi } from "common/backend/infrastructure";
import { loggerCreator } from "common/utils/logger";
import { CacheApiResult, InfrastructureResponse } from "common/backend/infrastructure/_types/infrastructureTypes";

const moduleLogger = loggerCreator(__filename);

export class InfrastructureApiMock implements InfrastructureApi {
  async cachesList(cdnId: string, metadata: AjaxMetadata): Promise<CacheApiResult> {
    return {
      caches: [
        {
          systemId: "testQn007",
          networkId: 0,
          interfaces: [],
        },
        {
          systemId: "testQn008",
          networkId: 0,
          interfaces: [],
        },
        {
          systemId: "59CWH42",
          networkId: 100,
          interfaces: [],
        },
        {
          systemId: "3T0DF5J",
          networkId: 100,
          interfaces: [],
        },
        {
          systemId: "4683ZX1",
          networkId: 100,
          interfaces: [
            {
              interfaceName: "yuval-test-interface",
              ipv4Address: "10.0.0.3",
              ipv6Address: "2001:abc::1",
            },
            {
              interfaceName: "TenGigE0/1",
              ipv4Address: "10.0.0.3",
              ipv6Address: null,
            },
            {
              interfaceName: "yuval-test-interface2",
              ipv4Address: "10.0.0.3",
              ipv6Address: null,
            },
          ],
        },
        {
          systemId: "53GXG62",
          networkId: 100,
          interfaces: [],
        },
      ],
    };
  }

  async cacheAssignmentCreate(systemId: string, cdnId: string): Promise<InfrastructureResponse> {
    return {};
  }

  async cacheAssignmentDelete(systemId: string): Promise<InfrastructureResponse> {
    return {};
  }

  async cacheAssignmentUpdate(systemId: string, cdnId: string): Promise<InfrastructureResponse> {
    return {};
  }

  //region [[ Singleton ]]
  protected static _instance: InfrastructureApiMock | undefined;
  static get instance(): InfrastructureApiMock {
    if (!this._instance) {
      this._instance = new InfrastructureApiMock();
    }

    return this._instance;
  }
  //endregion
}

//region [[ Mock config types ]]
interface InfrastructureApiMockConfig {
  sampleText: string;
}
//endregion
