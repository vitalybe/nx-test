/* eslint-disable */
import { sleep } from "common/utils/sleep";
import { DeliveryServicesApi } from "common/backend/deliveryServices";
import {
  DeliveryServicesApiDocsType,
  DeliveryServicesApiResult,
  DeliveryServicesApiType,
  DeliveryServicesEditApiType,
  DeliveryServicesLabelsApiType,
} from "common/backend/deliveryServices/_types/deliveryServicesTypes";
import { loggerCreator } from "common/utils/logger";
import { mockNetworkSleep } from "common/utils/mockUtils";
import mockData from "common/backend/_utils/mockData";
import {
  BatchApiType,
  TemplateRevisionApiResult,
  TemplateRevisionEditApiType,
  TemplateRevisionLabelsApiType,
  TemplateRevisionVariables,
  TemplatesApiResult,
  TemplatesApiType,
  TemplatesEditApiType,
} from "common/backend/deliveryServices/_types/deliveryServicesTemplatesTypes";
import {
  RevisionApiType,
  RevisionLabelsApiType,
} from "common/backend/deliveryServices/_types/deliveryServiceRevisionTypes";
import { AjaxMetadata } from "common/utils/ajax";
import {
  DeliveryServiceMetadataApiResult,
  DeliveryServiceMetadataCreateApiType,
  DeliveryServiceMetadataEditApiType,
  DeliveryServiceMetadataIconType,
  MetadataServiceTypeEnum,
} from "common/backend/deliveryServices/_types/deliveryServiceMetadataTypes";

const moduleLogger = loggerCreator(__filename);

export class DeliveryServicesApiMock extends DeliveryServicesApi {
  async apiDocs(): Promise<DeliveryServicesApiDocsType> {
    await sleep(mockNetworkSleep);

    return {
      definitions: {
        Object1: {
          type: "object",
          properties: {
            Object2: {
              type: "string",
            },
          },
          title: "Object1",
        },
        Object3: {
          type: "object",
          properties: {
            Object4: {
              type: "number",
            },
          },
          title: "Object3",
        },
      },
    };
  }

  //region Delivery Services
  async listDeliveryServices(): Promise<DeliveryServicesApiResult> {
    await sleep(mockNetworkSleep);

    return [
      {
        dsId: "5dc81825791b35000113d234",
        ownerOrgId: "devorg",
        apiVersion: "4.0.0",
        name: "Vitaly-test",
        description: "a2",
        isActive: false,
        metadataId: "5fce3a4ecb887f0001703667",
        userData: {},
        dsRevisionDescriptions: [
          {
            dsRevisionId: "5e1f2726f09c710001a51bfc",
            creationTimeMilli: 1579099942023,
            creationTimeFormatted: "2020-01-15T14:52:22.023Z",
            labels: [],
          },
          {
            dsRevisionId: "5e1f067af09c71000134a00f",
            creationTimeMilli: 1579091578615,
            creationTimeFormatted: "2020-01-15T12:32:58.615Z",
            labels: [],
          },
        ],
        links: [],
      },
      {
        dsId: "5dc818d1791b35000113d236",
        ownerOrgId: "devorg",
        apiVersion: "4.0.0",
        name: "Vitaly-New revision that has a very long name",
        description: "s",
        isActive: false,
        metadataId: "5fce3a4ecb887f0001703667",
        userData: {},
        dsRevisionDescriptions: [
          {
            dsRevisionId: "5dcbbe178ae8ab0001bdc0d0",
            creationTimeMilli: 1573633559689,
            creationTimeFormatted: "2019-11-13T08:25:59.689Z",
            labels: [],
          },
          {
            dsRevisionId: "5dc818f3791b35000113d237",
            creationTimeMilli: 1573394675171,
            creationTimeFormatted: "2019-11-10T14:04:35.171Z",
            labels: ["vvvv"],
          },
        ],
        links: [],
      },
      {
        dsId: "5e1d877b011111000188d6ca",
        ownerOrgId: "devorg",
        apiVersion: "4.0.0",
        name: "Yuval-test",
        description: "yuval ui test",
        isActive: false,
        metadataId: "5fce3a4ecb887f0001703667",
        userData: {},
        dsRevisionDescriptions: [
          {
            dsRevisionId: "5e204177f09c710001a51c27",
            creationTimeMilli: 1579172215218,
            creationTimeFormatted: "2020-01-16T10:56:55.218Z",
            labels: [],
          },
          {
            dsRevisionId: "5e203deef09c710001a51c26",
            creationTimeMilli: 1579171310707,
            creationTimeFormatted: "2020-01-16T10:41:50.707Z",
            labels: [],
          },
          {
            dsRevisionId: "5e203d81f09c710001a51c25",
            creationTimeMilli: 1579171201131,
            creationTimeFormatted: "2020-01-16T10:40:01.131Z",
            labels: [],
          },
        ],
        links: [],
      },
    ];
  }

  async singleDeliveryService(): Promise<DeliveryServicesApiType> {
    await sleep(mockNetworkSleep);

    return {
      dsId: "5dc81825791b35000113d234",
      ownerOrgId: "devorg",
      apiVersion: "4.0.0",
      name: "Vitaly-test",
      description: "a2",
      isActive: false,
      metadataId: "5fce3a4ecb887f0001703667",
      userData: {},
      dsRevisionDescriptions: [
        {
          dsRevisionId: "5e1f2726f09c710001a51bfc",
          creationTimeMilli: 1579099942023,
          creationTimeFormatted: "2020-01-15T14:52:22.023Z",
          labels: [],
        },
        {
          dsRevisionId: "5e1f067af09c71000134a00f",
          creationTimeMilli: 1579091578615,
          creationTimeFormatted: "2020-01-15T12:32:58.615Z",
          labels: [],
        },
      ],
      links: [],
    };
  }

  async updateDeliveryService(id: string, entity: DeliveryServicesEditApiType): Promise<DeliveryServicesApiType> {
    await sleep(mockNetworkSleep);
    moduleLogger.debug("Mock update, id: " + id);
    moduleLogger.debug(JSON.stringify(entity));

    return entity as DeliveryServicesApiType;
  }

  async createDeliveryService(entity: DeliveryServicesEditApiType): Promise<DeliveryServicesApiType> {
    await sleep(mockNetworkSleep);
    moduleLogger.debug("Mock create: ");
    moduleLogger.debug(JSON.stringify(entity));

    return {} as DeliveryServicesApiType;
  }

  async deleteDeliveryService(id: string): Promise<void> {
    await sleep(mockNetworkSleep);
    moduleLogger.debug("Mock delete: " + id);
  }

  async previewRevision(id: string, data: object): Promise<unknown> {
    await sleep(mockNetworkSleep);
    moduleLogger.debug("Mock preview, id: " + id);
    moduleLogger.debug(JSON.stringify(data));

    return data;
  }

  async labelMapping(id: string): Promise<DeliveryServicesLabelsApiType> {
    await sleep(mockNetworkSleep);
    moduleLogger.debug("Mock labels, id: " + id);

    return {
      [mockData.dsRevisionLabels]: "mockId",
    };
  }
  //endregion

  //region Templates
  async listTemplates(): Promise<TemplatesApiResult> {
    await sleep(mockNetworkSleep);

    return [
      {
        templateId: "5dc81825791b35000113d234",
        ownerOrgId: "devorg",
        name: "Yuval-test",
        description: "a2",
        templateRevisionDescriptions: [
          {
            templateRevisionId: "5e1f2726f09c710001a51bfc",
            creationTimeMilli: 1579099942023,
            creationTimeFormatted: "2020-01-15T14:52:22.023Z",
            username: "yuvalw@qwilt.com",
            labels: [],
          },
          {
            templateRevisionId: "5e1f067af09c71000134a00f",
            creationTimeMilli: 1579091578615,
            creationTimeFormatted: "2020-01-15T12:32:58.615Z",
            username: "yuvalw@qwilt.com",
            labels: [],
          },
        ],
      },
      {
        templateId: "5dc818d1791b35000113d236",
        ownerOrgId: "devorg",
        name: "Yuval-New Template",
        description: "s",
        templateRevisionDescriptions: [
          {
            templateRevisionId: "5dcbbe178ae8ab0001bdc0d0",
            creationTimeMilli: 1573633559689,
            creationTimeFormatted: "2019-11-13T08:25:59.689Z",
            username: "yuvalw@qwilt.com",
            labels: [],
          },
          {
            templateRevisionId: "5dc818f3791b35000113d237",
            creationTimeMilli: 1573394675171,
            creationTimeFormatted: "2019-11-10T14:04:35.171Z",
            username: "yuvalw@qwilt.com",
            labels: ["vvvv"],
          },
        ],
      },
      {
        templateId: "5e1d877b011111000188d6ca",
        ownerOrgId: "devorg",
        name: "Yuval-test-2",
        description: "yuval ui test",
        templateRevisionDescriptions: [
          {
            templateRevisionId: "5e204177f09c710001a51c27",
            creationTimeMilli: 1579172215218,
            creationTimeFormatted: "2020-01-16T10:56:55.218Z",
            username: "yuvalw@qwilt.com",
            labels: [],
          },
          {
            templateRevisionId: "5e203deef09c710001a51c26",
            creationTimeMilli: 1579171310707,
            creationTimeFormatted: "2020-01-16T10:41:50.707Z",
            username: "yuvalw@qwilt.com",
            labels: [],
          },
          {
            templateRevisionId: "5e203d81f09c710001a51c25",
            creationTimeMilli: 1579171201131,
            creationTimeFormatted: "2020-01-16T10:40:01.131Z",
            username: "yuvalw@qwilt.com",
            labels: [],
          },
        ],
      },
    ];
  }

  async getTemplate(): Promise<TemplatesApiType> {
    await sleep(mockNetworkSleep);

    return {
      templateId: "5dc81825791b35000113d234",
      ownerOrgId: "devorg",
      name: "Yuval-test",
      description: "a2",
      templateRevisionDescriptions: [
        {
          templateRevisionId: "5e1f2726f09c710001a51bfc",
          creationTimeMilli: 1579099942023,
          creationTimeFormatted: "2020-01-15T14:52:22.023Z",
          username: "yuvalw@qwilt.com",
          labels: [],
        },
        {
          templateRevisionId: "5e1f067af09c71000134a00f",
          creationTimeMilli: 1579091578615,
          creationTimeFormatted: "2020-01-15T12:32:58.615Z",
          username: "yuvalw@qwilt.com",
          labels: [],
        },
      ],
    };
  }

  async updateTemplate(id: string, entity: TemplatesEditApiType): Promise<TemplatesApiType> {
    await sleep(mockNetworkSleep);
    moduleLogger.debug("Mock update, id: " + id);
    moduleLogger.debug(JSON.stringify(entity));

    return entity as TemplatesApiType;
  }

  async createTemplate(entity: TemplatesEditApiType): Promise<TemplatesApiType> {
    await sleep(mockNetworkSleep);
    moduleLogger.debug("Mock create: ");
    moduleLogger.debug(JSON.stringify(entity));
    return entity as TemplatesApiType;
  }

  async deleteTemplate(id: string): Promise<void> {
    await sleep(mockNetworkSleep);
    moduleLogger.debug("Mock delete: " + id);
  }
  //endregion

  //region Template Revisions
  async createTemplateRevision(
    templateId: string,
    values: TemplateRevisionEditApiType
  ): Promise<TemplateRevisionApiResult> {
    await sleep(mockNetworkSleep);
    moduleLogger.debug("Mock create: ");
    moduleLogger.debug(JSON.stringify(values));
    return values as TemplateRevisionApiResult;
  }

  async getTemplateRevision(): Promise<TemplateRevisionApiResult> {
    await sleep(mockNetworkSleep);
    return {
      templateId: "5e4e592e2e016f0001046c31",
      ownerOrgId: "devorg",
      creationTimeMilli: 1582549654447,
      creationTimeFormatted: "2020-02-24T13:07:34.447Z",
      username: "yuvalw@qwilt.com",
      templateRevisionId: "5e1f2726f09c710001a51bfc",
      templateRevisionData: {
        serviceType: "live",
        protocols: ["http", "https"],
        httpVersions: ["http/1.1"],
        redirectHttpToHttps: {
          enabled: false,
        },
        redirectRouting: {
          enabled: true,
        },
        manifestRewriteRouting: {
          enabled: false,
        },
        serviceToken: "cbs-live",
        identification: {
          match: {
            any: [
              {
                rule: {
                  hostnameSuffix: ".cbsaavideo.com",
                },
              },
              {
                rule: {
                  hostnameByServiceToken: true,
                },
              },
            ],
          },
        },
        components: [
          {
            name: "hls-video",
          },
        ],
      },
      templateVariables: [
        {
          name: "REGEX_RULE",
        },
        {
          name: "SERVICE_TYPE",
        },
      ],
    };
  }

  async deleteAllTemplateRevisions(dsId: string): Promise<void> {
    await sleep(mockNetworkSleep);
    moduleLogger.debug("Mock delete All revisions: " + dsId + " ds");
  }

  async deleteTemplateRevision(templateId: string, revisionId: string): Promise<void> {
    await sleep(mockNetworkSleep);
    moduleLogger.debug("Mock delete: " + templateId + " - " + revisionId);
  }

  async getTemplateRevisionVariables(): Promise<TemplateRevisionVariables> {
    await sleep(mockNetworkSleep);

    return {
      templateVariables: [
        {
          name: "REGEX_RULE",
        },
        {
          name: "SERVICE_TYPE",
        },
      ],
    };
  }

  async updateTemplateRevisionTags(
    templateId: string,
    revisionId: string,
    tags: string[]
  ): Promise<TemplateRevisionLabelsApiType> {
    await sleep(mockNetworkSleep);
    moduleLogger.debug("Mock update tags, id: " + templateId);

    return { labels: tags } as TemplateRevisionLabelsApiType;
  }
  //endregion

  //region DS Revision
  async getRevision(): Promise<RevisionApiType> {
    await sleep(mockNetworkSleep);

    return {
      dsRevisionId: "steam-content-dnld-1",
      dsId: "0",
      apiVersion: "http/1.1",
      creationTime: new Date(),
      creationTimeMilli: 0,
      creationTimeFormatted: "10-10-2019",
      username: "username@qwilt.com",
      serviceType: "live",
      protocols: ["http", "https"],
      httpVersions: ["http/1.1", "http/2"],
      redirectHttpToHttps: { enabled: true },
      redirectRouting: { enabled: false },
      manifestRewriteRouting: { enabled: true },
      serviceToken: "Erggr",
      identification: this.getJsonExample(),
      nameResolution: this.getJsonExample(),
      components: [this.getSmallJsonExample(), this.getSmallJsonExample(), this.getSmallJsonExample()],
      unidentifiedComponent: this.getJsonExample(),
      origin: this.getJsonExample(),
      fallback: this.getJsonExample(),
      ownerOrgId: "erggr",
      debug: this.getJsonExample(),
      rawJson: this.getJsonExample(),
      userData: this.getJsonExample(),
    };
  }

  getJsonExample(): object {
    return {
      name: "Jack",
      method: "HTTP_REDIRECT",
      httpRedirectRoutingMethod: {
        additionalResponseHeaders: ["Access-Control-Allowed-Origins: *"],
        subDomainLabel: "opencachehub",
        contentAffinity: {
          pathCaptureRegex: "",
          dispersion: {
            method: "EXPLICIT",
            value: 1,
          },
        },
      },
      dnsRoutingMethod: null,
      manifestRewriteRoutingMethod: null,
    };
  }

  getSmallJsonExample(): object {
    return {
      name: "Jack",
      method: "HTTP_REDIRECT",
      dnsRoutingMethod: null,
    };
  }

  async updateRevision(dsId: string, entity: RevisionApiType) {
    await sleep(mockNetworkSleep);
    moduleLogger.debug("Mock update, id: " + dsId);
    moduleLogger.debug(JSON.stringify(entity));
  }

  async createRevision(dsId: string, entity: RevisionApiType) {
    await sleep(mockNetworkSleep);
    moduleLogger.debug("Mock create: ");
    moduleLogger.debug(JSON.stringify(entity));

    return entity as RevisionApiType;
  }

  async updateRevisionTags(dsId: string, revisionId: string, tags: string[]): Promise<RevisionLabelsApiType> {
    await sleep(mockNetworkSleep);
    moduleLogger.debug("Mock update tags, id: " + dsId + " / " + revisionId + " / " + tags);
    return { labels: tags } as RevisionLabelsApiType;
  }
  //endregion

  //region Metadata
  async getMetadata(id: string, metadata: AjaxMetadata): Promise<DeliveryServiceMetadataApiResult> {
    await sleep(mockNetworkSleep);

    return {
      metadataId: "1234",
      contentGroupId: 1234,
      ownerOrgId: "disney-plus",
      type: MetadataServiceTypeEnum.LIVE,
      reportingName: "disney-plus-live-delivery-service",
      userFriendlyName: "Disney Plus Live Delivery Service",
      delegationTargets: ["dlt1", "dlt2"],
    };
  }

  async listMetadata(metadata: AjaxMetadata): Promise<DeliveryServiceMetadataApiResult[]> {
    await sleep(mockNetworkSleep);

    return [];
  }

  async updateMetadata(id: string, entity: DeliveryServiceMetadataEditApiType) {
    await sleep(mockNetworkSleep);
    moduleLogger.debug("Mock update, id: " + id);
    moduleLogger.debug(JSON.stringify(entity));
    return entity as DeliveryServiceMetadataApiResult;
  }

  async createMetadata(entity: DeliveryServiceMetadataCreateApiType) {
    await sleep(mockNetworkSleep);
    moduleLogger.debug("Mock create: ");
    moduleLogger.debug(JSON.stringify(entity));
    return {} as DeliveryServiceMetadataApiResult;
  }

  async deleteMetadata(id: string) {
    await sleep(mockNetworkSleep);
    moduleLogger.debug("Mock delete: " + id);
  }

  async updateMetadataIcon(id: string, entity: DeliveryServiceMetadataIconType) {
    await sleep(mockNetworkSleep);
    moduleLogger.debug("Mock update, id: " + id);
    moduleLogger.debug(JSON.stringify(entity));
  }

  async getMetadataIcon(id: string, metadata: AjaxMetadata): Promise<DeliveryServiceMetadataIconType> {
    await sleep(mockNetworkSleep);

    return {
      iconData: "base64string",
    };
  }
  //endregion

  async createBatch(data: BatchApiType): Promise<void> {
    await sleep(mockNetworkSleep);
    moduleLogger.debug("Mock create batch" + data);
  }

  //region [[ Singleton ]]
  protected static _instance: DeliveryServicesApiMock | undefined;
  static get instance(): DeliveryServicesApiMock {
    if (!this._instance) {
      this._instance = new DeliveryServicesApiMock();
    }

    return this._instance;
  }
  //endregion
}
