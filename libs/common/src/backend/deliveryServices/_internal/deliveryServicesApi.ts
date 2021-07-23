import { loggerCreator } from "../../../utils/logger";
import { getOriginForApi } from "../../backendOrigin";
import { combineUrl } from "../../../utils/combineUrl";
import { UrlParams } from "../../_utils/urlParams";
import { Ajax, AjaxMetadata } from "../../../utils/ajax";
import { devToolsStore } from "../../../components/devTools/_stores/devToolsStore";
import {
  DeliveryServicesApiDocsType,
  DeliveryServicesApiResult,
  DeliveryServicesApiType,
  DeliveryServicesEditApiType,
  DeliveryServicesLabelsApiType,
} from "../_types/deliveryServicesTypes";
import { DeliveryServicesApiMock } from "../../deliveryServices";
import { MockWrapperProxy } from "../../_utils/mockWrapperProxy/mockWrapperProxy";
import { UrlStore } from "../../../stores/urlStore/urlStore";
import { CommonUrlParams } from "../../../urlParams/commonUrlParams";
import { DeliveryServicesUtils } from "../_utils/utils";
import {
  BatchApiType,
  TemplateRevisionApiResult,
  TemplateRevisionEditApiType,
  TemplateRevisionLabelsApiType,
  TemplateRevisionVariables,
  TemplatesApiResult,
  TemplatesApiType,
  TemplatesEditApiType,
} from "../_types/deliveryServicesTemplatesTypes";
import {
  RevisionApiType,
  RevisionLabelsApiType,
} from "../_types/deliveryServiceRevisionTypes";
import {
  DeliveryServiceMetadataApiResult,
  DeliveryServiceMetadataCreateApiType,
  DeliveryServiceMetadataEditApiType,
  DeliveryServiceMetadataIconType,
} from "../_types/deliveryServiceMetadataTypes";

const moduleLogger = loggerCreator("__filename");
const BACKEND_URL = combineUrl(getOriginForApi("delivery-services"), "/api/4.0/");
const ORG_ID_HEADER = "X-QC-OrgId";

export class DeliveryServicesApi {
  protected constructor() {}

  async apiDocs(metadata: AjaxMetadata): Promise<DeliveryServicesApiDocsType> {
    const path = combineUrl(getOriginForApi("delivery-services"), "/v2/api-docs");

    return (await Ajax.getJson(combineUrl(path), metadata)) as DeliveryServicesApiDocsType;
  }

  async createBatch(data: BatchApiType): Promise<void> {
    const path = combineUrl(BACKEND_URL, "batch-create-delivery-services-revisions-from-template");

    await Ajax.postJson(path, data);
  }

  async labelMapping(id: string): Promise<DeliveryServicesLabelsApiType> {
    const path = combineUrl("delivery-services", id, "label-mapping");
    const params = new UrlParams({}).stringified;

    return (await Ajax.getJson(combineUrl(BACKEND_URL, path, params))) as DeliveryServicesLabelsApiType;
  }

  //region Delivery Services
  async listDeliveryServices(metadata: AjaxMetadata, includeRevisions = true): Promise<DeliveryServicesApiResult> {
    const path = combineUrl("delivery-services");
    const urlParams = new UrlParams({});
    if (!includeRevisions) {
      urlParams.set({ "revision-descriptions": false });
    }

    const data = (await Ajax.getJson(
      combineUrl(BACKEND_URL, path, urlParams.stringified),
      metadata
    )) as DeliveryServicesApiResult;
    const isObfuscateEntities = UrlStore.getInstance().getParamExists(CommonUrlParams.obfuscate);

    if (isObfuscateEntities) {
      return data.map((deliveryServiceApiType) => DeliveryServicesUtils.obfuscateDsName(deliveryServiceApiType));
    }

    return data;
  }

  async singleDeliveryService(id: string, metadata: AjaxMetadata): Promise<DeliveryServicesApiType> {
    const path = combineUrl("delivery-services", id);
    const params = new UrlParams({}).stringified;

    return (await Ajax.getJson(combineUrl(BACKEND_URL, path, params), metadata)) as DeliveryServicesApiType;
  }

  async createDeliveryService(values: DeliveryServicesEditApiType): Promise<DeliveryServicesApiType> {
    const path = combineUrl("delivery-services");
    const params = new UrlParams({}).stringified;

    return (await Ajax.postJson(combineUrl(BACKEND_URL, path, params), values)) as DeliveryServicesApiType;
  }

  async updateDeliveryService(id: string, values: DeliveryServicesEditApiType): Promise<DeliveryServicesApiType> {
    const path = combineUrl("delivery-services", id);
    const params = new UrlParams({}).stringified;

    return (await Ajax.putJson(combineUrl(BACKEND_URL, path, params), values)) as DeliveryServicesApiType;
  }

  async deleteDeliveryService(id: string): Promise<void> {
    const path = combineUrl("delivery-services", id);
    const params = new UrlParams({}).stringified;

    await Ajax.deleteJson(combineUrl(BACKEND_URL, path, params));
  }

  //endregion

  //region Templates
  async listTemplates(metadata: AjaxMetadata): Promise<TemplatesApiResult> {
    const path = combineUrl("templates");
    const params = new UrlParams({}).stringified;

    return (await Ajax.getJson(combineUrl(BACKEND_URL, path, params), metadata)) as TemplatesApiResult;
  }

  async getTemplate(id: string, metadata: AjaxMetadata): Promise<TemplatesApiType> {
    const path = combineUrl("templates", id);
    const params = new UrlParams({}).stringified;

    return (await Ajax.getJson(combineUrl(BACKEND_URL, path, params), metadata)) as TemplatesApiType;
  }

  async createTemplate(values: TemplatesEditApiType): Promise<TemplatesApiType> {
    const path = combineUrl("templates");
    const params = new UrlParams({}).stringified;

    return (await Ajax.postJson(combineUrl(BACKEND_URL, path, params), values)) as TemplatesApiType;
  }

  async updateTemplate(id: string, values: TemplatesEditApiType): Promise<TemplatesApiType> {
    const path = combineUrl("templates", id);
    const params = new UrlParams({}).stringified;

    return (await Ajax.putJson(combineUrl(BACKEND_URL, path, params), values)) as TemplatesApiType;
  }

  async deleteTemplate(id: string): Promise<void> {
    const path = combineUrl("templates", id);
    const params = new UrlParams({}).stringified;

    await Ajax.deleteJson(combineUrl(BACKEND_URL, path, params));
  }
  //endregion

  //region Template Revisions
  async createTemplateRevision(
    templateId: string,
    values: TemplateRevisionEditApiType
  ): Promise<TemplateRevisionApiResult> {
    const path = combineUrl("templates", templateId, "revisions");
    const params = new UrlParams({}).stringified;

    return (await Ajax.postJson(combineUrl(BACKEND_URL, path, params), values)) as TemplateRevisionApiResult;
  }

  async getTemplateRevision(
    templateId: string,
    revisionId: string,
    metadata: AjaxMetadata
  ): Promise<TemplateRevisionApiResult> {
    const path = combineUrl("templates", templateId, "revisions", revisionId);
    const params = new UrlParams({}).stringified;

    return (await Ajax.getJson(combineUrl(BACKEND_URL, path, params), metadata)) as TemplateRevisionApiResult;
  }

  async deleteAllTemplateRevisions(dsId: string): Promise<void> {
    const path = combineUrl("templates", dsId);
    const params = new UrlParams({}).stringified;

    await Ajax.deleteJson(combineUrl(BACKEND_URL, path, params));
  }

  async deleteTemplateRevision(templateId: string, revisionId: string): Promise<void> {
    const path = combineUrl("templates", templateId, "revisions", revisionId);
    const params = new UrlParams({}).stringified;

    await Ajax.deleteJson(combineUrl(BACKEND_URL, path, params));
  }

  async getTemplateRevisionVariables(
    templateId: string,
    revisionId: string,
    metadata: AjaxMetadata
  ): Promise<TemplateRevisionVariables> {
    const path = combineUrl("templates", templateId, "revisions", revisionId, "variables");
    const params = new UrlParams({}).stringified;

    return (await Ajax.getJson(combineUrl(BACKEND_URL, path, params), metadata)) as TemplateRevisionVariables;
  }

  async updateTemplateRevisionTags(
    templateId: string,
    revisionId: string,
    tags: string[]
  ): Promise<TemplateRevisionLabelsApiType> {
    const data = {
      labels: tags,
    };

    const path = combineUrl("templates", templateId, "revisions", revisionId, "labels");
    const params = new UrlParams({}).stringified;

    return (await Ajax.putJson(combineUrl(BACKEND_URL, path, params), data)) as TemplateRevisionLabelsApiType;
  }
  //endregion

  //region DS Revision
  async getRevision(dsId: string, revisionId: string, metadata: AjaxMetadata): Promise<RevisionApiType> {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, "delivery-services/", dsId, "/revisions/", revisionId, params);

    const data = await Ajax.getJson(path, metadata);
    return data as RevisionApiType;
  }

  async updateRevisionTags(dsId: string, revisionId: string, tags: string[]): Promise<RevisionLabelsApiType> {
    const data = {
      labels: tags,
    };
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, "delivery-services/", dsId, "/revisions/", revisionId, "/labels", params);

    return (await Ajax.putJson(path, data)) as RevisionLabelsApiType;
  }

  async previewRevision(id: string, data: object): Promise<unknown> {
    const path = combineUrl("delivery-services", id, "preview-revision");
    const params = new UrlParams({}).stringified;

    return await Ajax.postJson(combineUrl(BACKEND_URL, path, params), data);
  }

  async updateRevision(dsId: string, entity: RevisionApiType | object): Promise<unknown> {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, "delivery-services/", dsId, "/revisions", params);

    return await Ajax.putJson(path, entity);
  }

  async createRevision(dsId: string, entity: RevisionApiType | object): Promise<RevisionApiType> {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, "delivery-services/", dsId, "/revisions", params);

    return (await Ajax.postJson(path, entity)) as RevisionApiType;
  }

  async deleteRevision(dsId: string, revisionId: string): Promise<void> {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, "delivery-services/", dsId, "/revisions/", revisionId, params);

    await Ajax.deleteJson(path);
  }
  //endregion

  //region Metadata
  async getMetadata(id: string, metadata: AjaxMetadata): Promise<DeliveryServiceMetadataApiResult> {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, "delivery-service-metadata", id, params);

    return (await Ajax.getJson(path, metadata)) as DeliveryServiceMetadataApiResult;
  }

  async listMetadata(metadata: AjaxMetadata): Promise<DeliveryServiceMetadataApiResult[]> {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, "delivery-service-metadata", params);

    const data = await Ajax.getJson(path, metadata);
    return data as DeliveryServiceMetadataApiResult[];
  }

  async updateMetadata(
    id: string,
    payload: DeliveryServiceMetadataEditApiType
  ): Promise<DeliveryServiceMetadataApiResult> {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, "delivery-service-metadata", id, params);

    return (await Ajax.putJson(path, payload)) as DeliveryServiceMetadataApiResult;
  }

  async createMetadata(
    entity: DeliveryServiceMetadataCreateApiType,
    orgId: string
  ): Promise<DeliveryServiceMetadataApiResult> {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, "delivery-service-metadata", params);

    return (await Ajax.postJson(path, entity, { [ORG_ID_HEADER]: orgId })) as DeliveryServiceMetadataApiResult;
  }

  async deleteMetadata(id: string, orgId: string) {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, "delivery-service-metadata", id, params);

    await Ajax.deleteJson(path, { [ORG_ID_HEADER]: orgId });
  }

  async updateMetadataIcon(id: string, entity: DeliveryServiceMetadataIconType) {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, "delivery-service-metadata", id, "icon", params);

    await Ajax.putJson(path, entity);
  }

  async getMetadataIcon(
    id: string,
    metadata: AjaxMetadata = new AjaxMetadata()
  ): Promise<DeliveryServiceMetadataIconType> {
    const params = new UrlParams({}).stringified;
    const path = combineUrl(BACKEND_URL, "delivery-service-metadata", id, "icon", params);

    const data = await Ajax.getJson(path, metadata);
    return data as DeliveryServiceMetadataIconType;
  }
  //endregion

  //region [[ Singleton ]]
  protected static _instance: DeliveryServicesApi | undefined;
  static get instance(): DeliveryServicesApi {
    if (!this._instance) {
      const realApi = new DeliveryServicesApi();
      const mockApi = MockWrapperProxy.wrap(realApi, DeliveryServicesApiMock.instance);
      this._instance = !devToolsStore.isMockMode ? realApi : mockApi;
    }

    return this._instance;
  }
  //endregion
}
