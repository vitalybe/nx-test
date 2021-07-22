import { sleep } from "common/utils/sleep";
import { CertificatesApi } from "common/backend/certificates";
import { CertificateCreateApiType, CertificatesApiType } from "common/backend/certificates/_types/certificatesTypes";
import { loggerCreator } from "common/utils/logger";
import { mockNetworkSleep } from "common/utils/mockUtils";

const moduleLogger = loggerCreator(__filename);

export class CertificatesApiMock extends CertificatesApi {
  async list(): Promise<CertificatesApiType[]> {
    await sleep(mockNetworkSleep);

    return [
      {
        certId: "wef",
        certificate: "ewfwef",
        certificateChain: "few2",
        creationDate: "qewfqwe",
        description: "Rfqf",
        devorg: "ewfef",
        domain: "Wefgweg",
        links: ["Wef", "wef"],
        notAfter: "WEweg",
        notBefore: "Wegw",
        pkHash: "weggwe",
        serialNumber: "grwgr",
        status: "wegew",
        tenant: "ewgwe",
        thumbprint: "WGweg",
        type: "Wegeg",
      },
    ];
  }

  async update(id: string, entity: CertificatesApiType) {
    await sleep(mockNetworkSleep);
    moduleLogger.debug("Mock update, id: " + id);
    moduleLogger.debug(JSON.stringify(entity));
  }

  async create(entity: CertificateCreateApiType) {
    await sleep(mockNetworkSleep);
    moduleLogger.debug("Mock create: ");
    moduleLogger.debug(JSON.stringify(entity));
  }

  async delete(id: string) {
    await sleep(mockNetworkSleep);
    moduleLogger.debug("Mock delete: " + id);
  }

  //region [[ Singleton ]]
  protected static _instance: CertificatesApiMock | undefined;
  static get instance(): CertificatesApiMock {
    if (!this._instance) {
      this._instance = new CertificatesApiMock();
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
  mockConfig: CertificatesApiMockConfig = this.getDefaultMockConfig();
  //endregion
}

//region [[ Mock config types ]]
interface CertificatesApiMockConfig {
  sampleText: string;
}
//endregion
