/* eslint-disable unused-imports/no-unused-vars */
import { AjaxMetadata } from "common/utils/ajax";
import { sleep } from "common/utils/sleep";
import { AuditLogApi } from "common/backend/auditLog";
import { AuditLogApiRequest, AuditLogApiResult } from "common/backend/auditLog/_types/auditLogTypes";
import { loggerCreator } from "common/utils/logger";
import { mockNetworkSleep } from "common/utils/mockUtils";

// noinspection JSUnusedLocalSymbols
const moduleLogger = loggerCreator(__filename);

export class AuditLogApiMock implements AuditLogApi {
  async listRecords(metadata: AjaxMetadata, requestBody: AuditLogApiRequest): Promise<AuditLogApiResult> {
    await sleep(mockNetworkSleep);

    return {
      totalPages: 0,
      records: [],
    };
  }

  //region [[ Singleton ]]
  protected static _instance: AuditLogApiMock | undefined;
  static get instance(): AuditLogApiMock {
    if (!this._instance) {
      this._instance = new AuditLogApiMock();
    }

    return this._instance;
  }
  //endregion
}

//region [[ Mock config types ]]
interface AuditLogApiMockConfig {
  sampleText: string;
}
//endregion
