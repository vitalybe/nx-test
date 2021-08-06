import { loggerCreator } from "../../../utils/logger";
import { getOriginForApi } from "../../backendOrigin";
import { combineUrl } from "../../../utils/combineUrl";
import { UrlParams } from "../../_utils/urlParams";
import { Ajax, AjaxMetadata } from "../../../utils/ajax";
import { devToolsStore } from "../../../components/devTools/_stores/devToolsStore";
import { ContentPublishersApiMock } from "../../contentPublishers";
import {
  ContentPublisherApiType,
  ContentPublisherUpdateApiType,
} from "../_types/contentPublishersTypes";
import { UrlStore } from "../../../stores/urlStore/urlStore";
import { CommonUrlParams } from "../../../urlParams/commonUrlParams";
import { ContentPublisherUtils } from "../_utils/utils";

const moduleLogger = loggerCreator("__filename");
const BACKEND_URL = combineUrl(getOriginForApi("content-publishers"), "/api/1.0.0/");

export class ContentPublishersApi {
  protected constructor() {}

  async contentPublishersList(metadata: AjaxMetadata): Promise<ContentPublisherApiType[]> {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, "content-publishers", params);

    const data = (await Ajax.getJson(path, metadata)) as ContentPublisherApiType[];
    const isObfuscateEntities = UrlStore.getInstance().getParamExists(CommonUrlParams.obfuscate);

    if (isObfuscateEntities) {
      return ContentPublisherUtils.obfuscateEntities(data);
    }

    return data;
  }

  async contentPublishersUpdate(id: string, entity: ContentPublisherUpdateApiType) {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, "content-publishers", id, params);

    await Ajax.putJson(path, entity);
  }

  async contentPublishersCreate(entity: ContentPublisherUpdateApiType) {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, "content-publishers", params);

    await Ajax.postJson(path, entity);
  }

  async contentPublishersDelete(id: string) {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, "content-publishers", id, params);

    await Ajax.deleteJson(path);
  }

  //region [[ Singleton ]]
  protected static _instance: ContentPublishersApi | undefined;
  static get instance(): ContentPublishersApi {
    if (!this._instance) {
      this._instance = !devToolsStore.isMockMode ? new ContentPublishersApi() : ContentPublishersApiMock.instance;
    }

    return this._instance;
  }
  //endregion
}
