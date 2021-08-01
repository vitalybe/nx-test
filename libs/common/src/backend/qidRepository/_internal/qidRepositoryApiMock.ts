import { sleep } from "common/utils/sleep";
import { QidRepositoryApi } from "common/backend/qidRepository";
import { loggerCreator } from "common/utils/logger";
import { QidMetadata } from "common/backend/qidRepository/_types/qidRepositoryTypes";
import { mockNetworkSleep } from "common/utils/mockUtils";

const moduleLogger = loggerCreator(__filename);

export class QidRepositoryApiMock extends QidRepositoryApi {
  async list(): Promise<QidMetadata[]> {
    await sleep(mockNetworkSleep);

    return [
      { systemId: "vitaly", creationTimeMilli: "1234", ownerOrgId: "vitaly", sha256: "123123" },
      { systemId: "vitaly1", creationTimeMilli: "1234", ownerOrgId: "vitaly", sha256: "123123" },
      { systemId: "vitaly2", creationTimeMilli: "1234", ownerOrgId: "vitaly", sha256: "123123" },
      { systemId: "vitaly3", creationTimeMilli: "1234", ownerOrgId: "vitaly", sha256: "123123" },
    ];
  }

  //region [[ Singleton ]]
  protected static _instance: QidRepositoryApiMock | undefined;
  static get instance(): QidRepositoryApiMock {
    if (!this._instance) {
      this._instance = new QidRepositoryApiMock();
    }

    return this._instance;
  }
  //endregion
}
