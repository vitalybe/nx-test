import { loggerCreator } from "../../../utils/logger";
import { getOriginForApi } from "../../backendOrigin";
import { combineUrl } from "../../../utils/combineUrl";
import { UrlParams } from "../../_utils/urlParams";
import { Ajax, AjaxMetadata } from "../../../utils/ajax";
import { devToolsStore } from "../../../components/devTools/_stores/devToolsStore";
import { KeysManagerApiMock } from "../../keysManager";
import {
  KeyApiCreateType,
  KeyApiType,
  KeysManagerKeysApiResult,
  KeysManagerKeysSetsApiResult,
  KeysSetApiReadType,
  KeysSetApiType,
} from "../_types/keysManagerTypes";

const moduleLogger = loggerCreator("__filename");
const BACKEND_URL = combineUrl(getOriginForApi("keys-manager"), "/api/1/");

export class KeysManagerApi {
  protected constructor() {}

  async listKeys(metadata: AjaxMetadata): Promise<KeysManagerKeysApiResult> {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, "keys", params);

    const data = await Ajax.getJson(path, metadata);
    return data as KeysManagerKeysApiResult;
  }

  async updateKey(id: number, entity: KeyApiType) {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, "keys", id.toString(), params);

    await Ajax.putJson(path, entity);
  }

  async createKey(entity: KeyApiCreateType) {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, "keys", params);

    await Ajax.postJson(path, entity);
  }

  async deleteKey(id: number) {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, "keys", id.toString(), params);

    await Ajax.deleteJson(path);
  }

  async listKeySets(metadata: AjaxMetadata): Promise<KeysManagerKeysSetsApiResult> {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, "key-sets", params);

    const data = await Ajax.getJson(path, metadata);
    return data as KeysManagerKeysSetsApiResult;
  }

  async updateKeySet(id: number, entity: KeysSetApiType) {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, "key-sets", id.toString(), params);

    await Ajax.putJson(path, entity);
  }

  async createKeySet(entity: KeysSetApiType): Promise<KeysSetApiReadType> {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, "key-sets", params);

    const data = await Ajax.postJson(path, entity);
    return data as KeysSetApiReadType;
  }

  async deleteKeySet(id: number) {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, "key-sets", id.toString(), params);

    await Ajax.deleteJson(path);
  }

  //region [[ Singleton ]]
  protected static _instance: KeysManagerApi | undefined;
  static get instance(): KeysManagerApi {
    if (!this._instance) {
      this._instance = !devToolsStore.isMockMode ? new KeysManagerApi() : KeysManagerApiMock.instance;
    }

    return this._instance;
  }
  //endregion
}
