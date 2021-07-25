import { loggerCreator } from "common/utils/logger";
import { getOriginForApi } from "common/backend/backendOrigin";
import { combineUrl } from "common/utils/combineUrl";
import { UrlParams } from "common/backend/_utils/urlParams";
import { Ajax, AjaxMetadata } from "common/utils/ajax";
import { devToolsStore } from "common/components/devTools/_stores/devToolsStore";
import { CertificatesApiMock } from "common/backend/certificates";
import { CertificateCreateApiType, CertificatesApiType } from "common/backend/certificates/_types/certificatesTypes";

const moduleLogger = loggerCreator(__filename);
const BACKEND_URL = combineUrl(getOriginForApi("cert-manager"), "/api/1.0.0/");

export class CertificatesApi {
  protected constructor() {}

  async list(metadata: AjaxMetadata): Promise<CertificatesApiType[]> {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, "certificates", params);

    const data = await Ajax.getJson(path, metadata);
    return data as CertificatesApiType[];
  }

  async update(id: string, entity: CertificatesApiType) {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, id, params);

    await Ajax.putJson(path, entity);
  }

  async create(certificate: CertificateCreateApiType) {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, "certificates", params);

    await Ajax.postJson(path, {
      certificate: certificate.certificate,
      certificateChain: certificate.certificateChain,
      privateKey: certificate.privateKey,
    });
  }

  async delete(id: string) {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, "/certificates/", id, params);

    await Ajax.deleteJson(path);
  }

  //region [[ Singleton ]]
  protected static _instance: CertificatesApi | undefined;
  static get instance(): CertificatesApi {
    if (!this._instance) {
      this._instance = !devToolsStore.isMockMode ? new CertificatesApi() : CertificatesApiMock.instance;
    }

    return this._instance;
  }
  //endregion
}
