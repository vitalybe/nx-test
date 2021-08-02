import { loggerCreator } from "common/utils/logger";
import { AjaxMetadata } from "common/utils/ajax";
import { AuditLogApiRequest, AuditLogApiType } from "../backend/auditLog/_types/auditLogTypes";
import { AuditLogApi } from "../backend/auditLog";

const moduleLogger = loggerCreator(__filename);

export class AuditLogExternalProvider {
  private constructor() {}

  provideAllRecords = async (metadata: AjaxMetadata, options: AuditLogApiRequest): Promise<AuditLogApiType[]> => {
    const recordsPerPage = 1000;
    const { totalPages, records } = await AuditLogApi.instance.listRecords(metadata, {
      ...options,
      recordsPerPage,
      pageNumber: 0,
    });

    for (let i = 1; i <= totalPages; i++) {
      const pageResult = await AuditLogApi.instance.listRecords(metadata, {
        ...options,
        recordsPerPage,
        pageNumber: i,
      });
      records.push(...pageResult.records);
    }

    return records;
  };

  //region [[ Singleton ]]
  private static _instance: AuditLogExternalProvider | undefined;
  static get instance(): AuditLogExternalProvider {
    if (!this._instance) {
      this._instance = new AuditLogExternalProvider();
    }

    return this._instance;
  }
  //endregion
}
