import { sleep } from "common/utils/sleep";
import { ContentManagementApi } from "common/backend/contentManagement";
import { loggerCreator } from "common/utils/logger";
import { PurgeRuleApi } from "common/backend/contentManagement/_types/contentManagementTypes";
import { mockNetworkSleep } from "common/utils/mockUtils";

const moduleLogger = loggerCreator(__filename);

export class ContentManagementApiMock extends ContentManagementApi {
  async list(): Promise<PurgeRuleApi[]> {
    await sleep(mockNetworkSleep);

    return [
      {
        ruleId: "5e1c6cbb58f0090001b1aaf3",
        ownerOrgId: "devorg",
        creationTimeMilli: 1578921147446,
        dsId: "5dc81825791b35000113d234",
        rule: {
          type: "INVALIDATION",
          expirationTimeMilli: 12345,
          invalidationRule: {
            invalidationMethod: "REGEX",
            regexInvalidationMethod: {
              regex: "hello-regex",
            },
          },
        },
      },
      {
        ruleId: "5e1c73e458f0090001b1aaf4",
        ownerOrgId: "devorg",
        creationTimeMilli: 1578922980164,
        dsId: "5dc81825791b35000113d234",
        rule: {
          type: "DELETION",
          expirationTimeMilli: 12345,
          deletionRule: {
            deletionMethod: "FULL_URL",
            fullUrlDeletionMethod: {
              fullUrl: "hello-full-url",
            },
          },
        },
      },
    ];
  }

  async create(entity: PurgeRuleApi) {
    await sleep(mockNetworkSleep);
    moduleLogger.debug("Mock create: ");
    moduleLogger.debug(JSON.stringify(entity));
  }

  async delete(id: string) {
    await sleep(mockNetworkSleep);
    moduleLogger.debug("Mock delete: " + id);
  }

  //region [[ Singleton ]]
  protected static _instance: ContentManagementApiMock | undefined;
  static get instance(): ContentManagementApiMock {
    if (!this._instance) {
      this._instance = new ContentManagementApiMock();
    }

    return this._instance;
  }
  //endregion

  //region [[ Mock config ]]
  private getDefaultMockConfig() {
    return {
      sampleText: "very mock",
    };
  }
  mockConfig: ContentManagementApiMockConfig = this.getDefaultMockConfig();
  //endregion
}

//region [[ Mock config types ]]
interface ContentManagementApiMockConfig {
  sampleText: string;
}
//endregion
