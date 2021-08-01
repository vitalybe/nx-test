import { getEnv, getOriginForApi } from "common/backend/backendOrigin";
import { Ajax, AjaxMetadata } from "common/utils/ajax";
import { UrlParams } from "common/backend/_utils/urlParams";
import { devToolsStore } from "common/components/devTools/_stores/devToolsStore";
import { QnDeploymentApiMock } from "common/backend/qnDeployment";
import {
  EntitiesApiModel,
  EntitiesParams,
  EntityHistoryModel,
  PostEntityModel,
  PostResponse,
} from "common/backend/qnDeployment/_types/entitiesApiType";
import { loggerCreator } from "common/utils/logger";
import { combineUrl } from "common/utils/combineUrl";
import { MockWrapperProxy } from "common/backend/_utils/mockWrapperProxy/mockWrapperProxy";
import { UrlStore } from "common/stores/urlStore/urlStore";
import { CommonUrlParams } from "common/urlParams/commonUrlParams";
import { QnDeploymentUtils } from "common/backend/qnDeployment/_utils/utils";

const moduleLogger = loggerCreator(__filename);

// writer is a central qn-deployment that doesn't suffer from eventual consistency issues.
// however, it is only available in prod
const API_NAME = getEnv() ? "qn-deployment" : "qn-deployment-writer";
const BACKEND_URL = combineUrl(getOriginForApi(API_NAME), "/api/2.1/");

export class QnDeploymentApi {
  async entitiesList(
    entitiesParams: EntitiesParams,
    metadata: AjaxMetadata = new AjaxMetadata()
  ): Promise<EntitiesApiModel> {
    const params = new UrlParams(entitiesParams).stringified;
    const path = combineUrl(BACKEND_URL, "entities/", params);

    const data = (await Ajax.getJson(path, metadata)) as EntitiesApiModel;

    const isObfuscateEntities = UrlStore.getInstance().getParamExists(CommonUrlParams.obfuscate);

    if (isObfuscateEntities) {
      return QnDeploymentUtils.obfuscateEntities(data);
    }

    return data as EntitiesApiModel;
  }

  async entitiesCreate(entity: PostEntityModel): Promise<PostResponse> {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, "entities/", params);

    const data = await Ajax.postJson(path, entity);
    return data as PostResponse;
  }

  async entitiesUpdate(entityId: string, entity: PostEntityModel): Promise<PostResponse> {
    const params = new UrlParams({ id: entityId }).stringified;
    const path = combineUrl(BACKEND_URL, "entities/", params);

    const data = await Ajax.putJson(path, entity);
    return data as PostResponse;
  }

  async entitiesDelete(entityId: string): Promise<EntitiesApiModel | undefined> {
    const params = new UrlParams({ ids: entityId }).stringified;
    const path = combineUrl(BACKEND_URL, "entities/", params);

    const data = await Ajax.deleteJson(path);
    return data as EntitiesApiModel;
  }

  async entityHistoryList(entityId: string, metadata: AjaxMetadata): Promise<EntityHistoryModel> {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, `history/${entityId}`, params);

    const data = await Ajax.getJson(path, metadata);
    return data as EntityHistoryModel;
  }

  //region [[ Singleton ]]
  protected static _instance: QnDeploymentApi | undefined;
  static get instance(): QnDeploymentApi {
    if (!this._instance) {
      const realApi = new QnDeploymentApi();
      const mockApi = MockWrapperProxy.wrap(realApi, QnDeploymentApiMock.instance);
      this._instance = !devToolsStore.isMockMode ? realApi : mockApi;
    }

    return this._instance;
  }
  //endregion
}
