import { ProvisionFlowsApiMock } from "@qwilt/common/backend/provisionFlows";
import { StepOutputApiResult } from "@qwilt/common/backend/provisionFlows/_types/provisionFlowsTypes";
import { EntityTypeEnum } from "@qwilt/common/backend/qnDeployment/_types/entitiesApiType";
import { DeploymentEntity } from "@qwilt/common/domain/qwiltDeployment/deploymentEntity";
import { DeploymentEntitiesProvider } from "@qwilt/common/providers/deploymentEntitiesProvider";
import { AjaxMetadata } from "@qwilt/common/utils/ajax";
import { UnknownObject } from "@qwilt/common/utils/typescriptUtils";
import { ContextDiffItemEntity } from "../_domain/contextDiffItemEntity";
import { ContextDiffListEntity } from "../_domain/contextDiffListEntity";
import { ContextDiffEntityTypeEnum } from "../_domain/contextEntityType";
import {
  ContextDiffSegmentsProvider,
  ListNameEnum,
} from "./contextDiffSegmentsProvider";
import { WorkflowEntity } from "../../_domain/workflowEntity";
import { DeliveryServiceEntity } from "../../../_domain/deliveryServiceEntity";
import { DeliveryServicesProvider } from "../../../_providers/deliveryServicesProvider";

async function getContextDiffSegmentsProviderResult(
  dataLeft: UnknownObject,
  additionalData?: {
    dataRight?: UnknownObject;
    networkNameById?: Record<number, string>;
    dsNameById?: Record<string, string>;
  }
) {
  const data = await ContextDiffSegmentsProvider.instance.provide(
    "1",
    WorkflowEntity.createMock({ id: "left" }),
    WorkflowEntity.createMock({ id: "right" }),
    new AjaxMetadata(),
    new (class extends ProvisionFlowsApiMock {
      async listStepOutput(cdnId: string, workflowId: string): Promise<StepOutputApiResult> {
        return {
          ["representationContext"]: {
            status: { flow: "success", errorLogs: "" },
            output: JSON.stringify({
              context: workflowId === "left" ? dataLeft : additionalData?.dataRight ?? dataLeft,
              meta: {
                cdnId: "cf6988d9-b341-412d-b978-99ccc407cf01",
                qcEnv: "cdn-i",
              },
            }),
          },
        };
      }
    })(),
    new (class extends DeploymentEntitiesProvider {
      provideNetworks = async (): Promise<DeploymentEntity[]> => {
        const networkNameById = additionalData?.networkNameById ?? {};
        return Object.entries(networkNameById).map(([id, name]) => ({
          id: parseInt(id),
          name: name,
          attributes: {},
          type: EntityTypeEnum.NETWORK,
          uniqueName: id,
        }));
      };
    })(),
    new (class extends DeliveryServicesProvider {
      provide = async (): Promise<DeliveryServiceEntity[]> => {
        const dsNameById = additionalData?.dsNameById ?? {};
        return Object.entries(dsNameById).map(
          ([id, name]) =>
            new DeliveryServiceEntity({
              id: id,
              name: name,
              description: "N/A",
              isActive: true,
              revisions: [],
              missingAgreementLinks: [],
            })
        );
      };
    })()
  );
  return data.segments;
}

describe("ContextDiffSegmentsProvider", function () {
  describe("should provide segment", function () {
    describe("network", function () {
      it("segment details", async function () {
        const segments = await getContextDiffSegmentsProviderResult(
          {
            "NETWORK/2749": {
              "https://cdn-i-qn-deployment.rnd.cqloud.com/api/2/entities?contained_in_list_format=none&contains_list_format=none&entities_list_format=details&ids=2749&types=network": {
                entities: [
                  {
                    attributes: {},
                    id: 2749,
                    name: "Charter",
                    type: "network",
                    uniqueName: "rgnAmerica_cnUsa_nwkCharter",
                  },
                ],
              },
            },
          },
          { networkNameById: { "2749": "Charter" } }
        );
        // Segment - Network
        expect(segments).toHaveLength(1);
        const segment = segments[0];
        expect(segment).toMatchObject({
          type: ContextDiffEntityTypeEnum.NETWORK,
          id: "NETWORK/2749",
          name: "Network - Charter",
          changeCount: 0,
          content: {
            kind: "known",
          },
        });
      });
      it("network details", async function () {
        const listName = "Network Details";
        const listType = ContextDiffEntityTypeEnum.NETWORK;

        const itemId = 1234;
        const itemName = "ITEM_NAME";

        const segments = await getContextDiffSegmentsProviderResult({
          "NETWORK/2749": {
            "https://cdn-i-qn-deployment.rnd.cqloud.com/api/2/entities?contained_in_list_format=none&contains_list_format=none&entities_list_format=details&ids=2749&types=network": {
              entities: [
                {
                  attributes: {},
                  id: itemId,
                  name: itemName,
                  type: "network",
                  uniqueName: "rgnAmerica_cnUsa_nwkCharter",
                },
              ],
            },
          },
        });
        const segmentChildren = segments[0].content.children as ContextDiffListEntity[];

        // List
        const list = segmentChildren.find((item) => item.name === listName) as ContextDiffListEntity;
        expect(list).toMatchObject({
          type: listType,
          name: listName,
          modifiedCount: 0,
          addedCount: 0,
          removedCount: 0,
          content: {
            kind: "known",
          },
        });
        const listChildren = list.content.children;

        // Items
        const item = listChildren.find((item) => item.name === itemName)!;
        expect(item).toMatchObject({
          type: listType,
          id: itemId,
          diff: {
            // Verify there is some data
            left: {
              uniqueName: "rgnAmerica_cnUsa_nwkCharter",
            },
            right: {
              uniqueName: "rgnAmerica_cnUsa_nwkCharter",
            },
          },
        });
        expect(item.diff.changesAmount).toEqual(0);
      });
      it("cache groups data", async function () {
        const listName = "Cache Groups";
        const listType = ContextDiffEntityTypeEnum.CACHE_GROUP;

        const itemName = "edge-2";
        const itemId = "0152ec88-2db0-48e8-8e77-a878bc1a7922";

        const segments = await getContextDiffSegmentsProviderResult({
          "NETWORK/2749": {
            "https://cdn-i-cdns.rnd.cqloud.com/api/1/cdns/cf6988d9-b341-412d-b978-99ccc407cf01/delivery-unit-groups?network_id=2749": {
              _links: {
                self: {
                  href:
                    "http://cdn-i-cdns.rnd.cqloud.com/api/1.0.0/cdns/cf6988d9-b341-412d-b978-99ccc407cf01/delivery-unit-groups?network_id=2749",
                },
              },
              duGroups: [
                {
                  _links: {
                    self: {
                      href:
                        "http://cdn-i-cdns.rnd.cqloud.com/api/1.0.0/cdns/cf6988d9-b341-412d-b978-99ccc407cf01/delivery-unit-groups/0152ec88-2db0-48e8-8e77-a878bc1a7922",
                    },
                  },
                  cdnId: "cf6988d9-b341-412d-b978-99ccc407cf01",
                  duGroupId: itemId,
                  fallbackDeliveryUnitGroups: [],
                  latitude: 0.0,
                  locationId: "3e18fe5f-785f-46a8-93be-b941800c8b07",
                  longitude: 0.0,
                  name: itemName,
                  networkId: 2749,
                  parentDeliveryUnitGroupId: null,
                  type: "edge",
                },
                {
                  _links: {
                    self: {
                      href:
                        "http://cdn-i-cdns.rnd.cqloud.com/api/1.0.0/cdns/cf6988d9-b341-412d-b978-99ccc407cf01/delivery-unit-groups/23db2529-d9e6-4724-be69-e679a3d9cdc3",
                    },
                  },
                  cdnId: "cf6988d9-b341-412d-b978-99ccc407cf01",
                  duGroupId: "23db2529-d9e6-4724-be69-e679a3d9cdc3",
                  fallbackDeliveryUnitGroups: [],
                  latitude: 0.0,
                  locationId: "3e18fe5f-785f-46a8-93be-b941800c8b07",
                  longitude: 0.0,
                  name: "mid-1",
                  networkId: 2749,
                  parentDeliveryUnitGroupId: null,
                  type: "mid",
                },
                {
                  _links: {
                    self: {
                      href:
                        "http://cdn-i-cdns.rnd.cqloud.com/api/1.0.0/cdns/cf6988d9-b341-412d-b978-99ccc407cf01/delivery-unit-groups/3d42f9b2-8c92-4ad0-9959-8982004f656a",
                    },
                  },
                  cdnId: "cf6988d9-b341-412d-b978-99ccc407cf01",
                  duGroupId: "3d42f9b2-8c92-4ad0-9959-8982004f656a",
                  fallbackDeliveryUnitGroups: [],
                  latitude: 0.0,
                  locationId: "3e18fe5f-785f-46a8-93be-b941800c8b07",
                  longitude: 0.0,
                  name: "edge-1",
                  networkId: 2749,
                  parentDeliveryUnitGroupId: "23db2529-d9e6-4724-be69-e679a3d9cdc3",
                  type: "edge",
                },
              ],
            },
          },
        });
        const segmentChildren = segments[0].content.children as ContextDiffListEntity[];

        // List
        const list = segmentChildren.find((item) => item.name === listName) as ContextDiffListEntity;
        expect(list).toMatchObject({
          type: listType,
          name: listName,
          modifiedCount: 0,
          addedCount: 0,
          removedCount: 0,
          content: {
            kind: "known",
          },
        });
        const listChildren = list.content.children;

        // Items
        const item = listChildren.find((item) => item.name === itemName)!;
        expect(item).toMatchObject({
          type: listType,
          id: itemId,
          diff: {
            // Verify there is some data
            left: {
              networkId: 2749,
            },
            right: {
              networkId: 2749,
            },
          },
        });
        expect(item.diff.changesAmount).toEqual(0);
      });
      it("caches data", async function () {
        const listName = "Caches";
        const listType = ContextDiffEntityTypeEnum.CACHE;

        const itemName = "amiry-qn-mid-1";
        const itemId = "amiry-qn-mid-1";

        const segments = await getContextDiffSegmentsProviderResult({
          "NETWORK/2749": {
            "https://cdn-i-cdns.rnd.cqloud.com/api/1/cdns/cf6988d9-b341-412d-b978-99ccc407cf01/delivery-units?network_id=2749": {
              _links: {
                self: {
                  href:
                    "http://cdn-i-cdns.rnd.cqloud.com/api/1.0.0/cdns/cf6988d9-b341-412d-b978-99ccc407cf01/delivery-units?network_id=2749",
                },
              },
              deliveryUnits: [
                {
                  _links: {
                    self: {
                      href:
                        "http://cdn-i-cdns.rnd.cqloud.com/api/1.0.0/cdns/cf6988d9-b341-412d-b978-99ccc407cf01/delivery-units/4d661819-0b85-4edf-bbec-48345b8262c1",
                    },
                  },
                  cacheHashId: "",
                  cdnId: "cf6988d9-b341-412d-b978-99ccc407cf01",
                  deliveryUnitId: itemId,
                  deliveryUnitInterfaces: {
                    "if-1": {
                      interfaceName: "if-1",
                      routingName: "",
                    },
                  },
                  duGroupId: "23db2529-d9e6-4724-be69-e679a3d9cdc3",
                  healthConnectionTimeoutMs: 2000,
                  healthHistoryCount: 30,
                  healthMaxLoadAverage: 25,
                  healthMaxQueryTimeMs: 2000,
                  healthMinAvailableBwKbps: 0,
                  healthMinAvailableBwKbpsEnabled: false,
                  healthPollUrlTemplate: null,
                  healthReportTimeMs: 200,
                  healthRequestTimeWarnMs: 100,
                  healthRequestTimeoutMs: 400,
                  healthSampleTimeMs: 1000,
                  monitoringSegmentId: "amiry-test-1",
                  name: itemName,
                  networkId: 2749,
                  numericId: 38,
                  operationalMode: "force-online",
                  systemId: "amiry-systemId",
                },
                {
                  _links: {
                    self: {
                      href:
                        "http://cdn-i-cdns.rnd.cqloud.com/api/1.0.0/cdns/cf6988d9-b341-412d-b978-99ccc407cf01/delivery-units/d0b1bcce-d5cc-414f-9950-b140916f907c",
                    },
                  },
                  cacheHashId: "",
                  cdnId: "cf6988d9-b341-412d-b978-99ccc407cf01",
                  deliveryUnitId: "d0b1bcce-d5cc-414f-9950-b140916f907c",
                  deliveryUnitInterfaces: {
                    "if-0": {
                      interfaceName: "if-0",
                      routingName: "",
                    },
                  },
                  duGroupId: "3d42f9b2-8c92-4ad0-9959-8982004f656a",
                  healthConnectionTimeoutMs: 2000,
                  healthHistoryCount: 30,
                  healthMaxLoadAverage: 25,
                  healthMaxQueryTimeMs: 2000,
                  healthMinAvailableBwKbps: 0,
                  healthMinAvailableBwKbpsEnabled: false,
                  healthPollUrlTemplate: null,
                  healthReportTimeMs: 200,
                  healthRequestTimeWarnMs: 100,
                  healthRequestTimeoutMs: 400,
                  healthSampleTimeMs: 1000,
                  monitoringSegmentId: "amiry-test-1",
                  name: "amiry-qn-edge-2",
                  networkId: 2749,
                  numericId: 39,
                  operationalMode: "online",
                  systemId: "amiry-qn-edge-2",
                },
              ],
            },
          },
        });
        const segmentChildren = segments[0].content.children as ContextDiffListEntity[];

        // List
        const list = segmentChildren.find((item) => item.name === listName) as ContextDiffListEntity;
        expect(list).toMatchObject({
          type: listType,
          name: listName,
          modifiedCount: 0,
          addedCount: 0,
          removedCount: 0,
          content: {
            kind: "known",
          },
        });
        const listChildren = list.content.children;

        // Items
        const item = listChildren.find((item) => item.name === itemName)!;
        expect(item).toMatchObject({
          type: listType,
          id: itemId,
          diff: {
            // Verify there is some data
            left: {
              networkId: 2749,
            },
            right: {
              networkId: 2749,
            },
          },
        });
        expect(item.diff.changesAmount).toEqual(0);
      });
      it("qn data", async function () {
        const listName = "QNs";
        const listType = ContextDiffEntityTypeEnum.QN_INFRA;

        const itemId = "ITEM_ID";
        const itemName = itemId;

        const segments = await getContextDiffSegmentsProviderResult({
          "NETWORK/2749": {
            "https://cdn-i-infrastructure.rnd.cqloud.com/api/1/cdn/caches?cdn=cf6988d9-b341-412d-b978-99ccc407cf01&network_id=2749": {
              _links: {
                self: {
                  href:
                    "http://cdn-i-infrastructure.rnd.cqloud.com/api/1/cdn/caches?cdn=cf6988d9-b341-412d-b978-99ccc407cf01&network_id=2749",
                },
              },
              caches: [
                {
                  cdn: "cf6988d9-b341-412d-b978-99ccc407cf01",
                  domain: "oper-domain.cqloud.com",
                  hostname: "oper-hostname-edge",
                  interfaces: [
                    {
                      interfaceName: "if-3",
                      ipv4Address: "5.6.7.8",
                      ipv6Address: null,
                      isTunnelEnabled: "true",
                      publicAddress: null,
                    },
                    {
                      interfaceName: "if-2",
                      ipv4Address: "1.2.3.4",
                      ipv6Address: null,
                      isTunnelEnabled: "true",
                      publicAddress: null,
                    },
                  ],
                  networkId: 2749,
                  systemId: itemId,
                },
                {
                  cdn: "cf6988d9-b341-412d-b978-99ccc407cf01",
                  domain: "oper-domain.cqloud.com",
                  hostname: "oper-hostname-mid",
                  interfaces: [
                    {
                      interfaceName: "if-1",
                      ipv4Address: "1.2.3.4",
                      ipv6Address: null,
                      isTunnelEnabled: "false",
                      publicAddress: null,
                    },
                  ],
                  networkId: 2749,
                  systemId: "amiry-qn-mid-1",
                },
                {
                  cdn: "cf6988d9-b341-412d-b978-99ccc407cf01",
                  domain: "oper-domain.cqloud.com",
                  hostname: "oper-hostname-edge-2",
                  interfaces: [
                    {
                      interfaceName: "if-0",
                      ipv4Address: "1.2.3.4",
                      ipv6Address: null,
                      isTunnelEnabled: "false",
                      publicAddress: null,
                    },
                  ],
                  networkId: 2749,
                  systemId: "amiry-qn-edge-2",
                },
              ],
            },
          },
        });
        const segmentChildren = segments[0].content.children as ContextDiffListEntity[];

        // List
        const list = segmentChildren.find((item) => item.name === listName) as ContextDiffListEntity;
        expect(list).toMatchObject({
          type: listType,
          name: listName,
          modifiedCount: 0,
          addedCount: 0,
          removedCount: 0,
          content: {
            kind: "known",
          },
        });
        const listChildren = list.content.children;

        // Items
        const item = listChildren.find((item) => item.name === itemName)!;
        expect(item).toMatchObject({
          type: listType,
          id: itemId,
          diff: {
            // Verify there is some data
            left: {
              networkId: 2749,
            },
            right: {
              networkId: 2749,
            },
          },
        });
        expect(item.diff.changesAmount).toEqual(0);
      });
    });
    describe("ds", function () {
      it("segment details", async function () {
        const type = ContextDiffEntityTypeEnum.DS;
        const dsId = `5e3c30469877620001b1b25e`;

        const segments = await getContextDiffSegmentsProviderResult(
          {
            [`DS/${dsId}`]: {
              ["https://cdn-i-delivery-services.rnd.cqloud.com/api/4/delivery-services/5e3c30469877620001b1b25e"]: {
                apiVersion: "4.0.0",
                description: "",
                dsId: `${dsId}`,
                dsRevisionDescriptions: [
                  {
                    creationTimeFormatted: "2020-09-29T18:38:26.031Z",
                    creationTimeMilli: 1601404706031,
                    dsRevisionId: "5f737f226f56800001fe4280",
                    labels: [],
                    username: "ofirh@qwilt.com",
                  },
                  {
                    creationTimeFormatted: "2020-09-29T11:33:48.102Z",
                    creationTimeMilli: 1601379228102,
                    dsRevisionId: "5f731b9c6f56800001fe427d",
                    labels: ["ofir-stable"],
                    username: "ofirh@qwilt.com",
                  },
                  {
                    creationTimeFormatted: "2020-09-29T11:24:46.791Z",
                    creationTimeMilli: 1601378686791,
                    dsRevisionId: "5f73197e6f56800001fe427c",
                    labels: [],
                    username: "ofirh@qwilt.com",
                  },
                  {
                    creationTimeFormatted: "2020-07-07T10:09:18.079Z",
                    creationTimeMilli: 1594116558079,
                    dsRevisionId: "5f0449ced8e99e0001883946",
                    labels: ["ofir-stable+https"],
                    username: "guyk@qwilt.com",
                  },
                  {
                    creationTimeFormatted: "2020-06-16T13:41:14.963Z",
                    creationTimeMilli: 1592314874963,
                    dsRevisionId: "5ee8cbfba8997a0001c53542",
                    labels: ["GA", "royr-no-service-token-error"],
                    username: "royr@qwilt.com",
                  },
                  {
                    creationTimeFormatted: "2020-06-13T17:07:28.213Z",
                    creationTimeMilli: 1592068048213,
                    dsRevisionId: "5ee507d0438a130001e4d026",
                    labels: ["royr-service-tokens"],
                    username: "royr@qwilt.com",
                  },
                  {
                    creationTimeFormatted: "2020-06-13T16:48:39.385Z",
                    creationTimeMilli: 1592066919385,
                    dsRevisionId: "5ee50367438a130001e4d025",
                    labels: [],
                    username: "royr@qwilt.com",
                  },
                  {
                    creationTimeFormatted: "2020-06-11T07:32:24.107Z",
                    creationTimeMilli: 1591860744107,
                    dsRevisionId: "5ee1de08438a130001e4d021",
                    labels: [],
                    username: "royr@qwilt.com",
                  },
                  {
                    creationTimeFormatted: "2020-06-11T07:31:51.381Z",
                    creationTimeMilli: 1591860711381,
                    dsRevisionId: "5ee1dde7438a130001e4d020",
                    labels: [],
                    username: "royr@qwilt.com",
                  },
                  {
                    creationTimeFormatted: "2020-06-11T07:25:37.479Z",
                    creationTimeMilli: 1591860337479,
                    dsRevisionId: "5ee1dc71438a130001e4d01f",
                    labels: [],
                    username: "royr@qwilt.com",
                  },
                  {
                    creationTimeFormatted: "2020-06-11T07:07:47.863Z",
                    creationTimeMilli: 1591859267863,
                    dsRevisionId: "5ee1d843438a130001e4d01e",
                    labels: [],
                    username: "royr@qwilt.com",
                  },
                  {
                    creationTimeFormatted: "2020-06-07T11:53:23.684Z",
                    creationTimeMilli: 1591530803684,
                    dsRevisionId: "5edcd5332657800001c1e25b",
                    labels: [],
                    username: "royr@qwilt.com",
                  },
                  {
                    creationTimeFormatted: "2020-04-22T14:27:16.041Z",
                    creationTimeMilli: 1587565636041,
                    dsRevisionId: "5ea0544463436d00010eae62",
                    labels: [],
                    username: "ofirh@qwilt.com",
                  },
                  {
                    creationTimeFormatted: "2020-04-22T14:22:07.771Z",
                    creationTimeMilli: 1587565327771,
                    dsRevisionId: "5ea0530f63436d00010eae61",
                    labels: ["stable"],
                    username: "ofirh@qwilt.com",
                  },
                  {
                    creationTimeFormatted: "2020-04-22T10:48:12.337Z",
                    creationTimeMilli: 1587552492337,
                    dsRevisionId: "5ea020ec63436d00010eae60",
                    labels: [],
                    username: "ofirh@qwilt.com",
                  },
                  {
                    creationTimeFormatted: "2020-04-22T10:31:30.567Z",
                    creationTimeMilli: 1587551490567,
                    dsRevisionId: "5ea01d0263436d00010eae5f",
                    labels: [],
                    username: "ofirh@qwilt.com",
                  },
                  {
                    creationTimeFormatted: "2020-04-21T13:32:51.256Z",
                    creationTimeMilli: 1587475971256,
                    dsRevisionId: "5e9ef60363436d00010eae5e",
                    labels: [],
                    username: "ofirh@qwilt.com",
                  },
                  {
                    creationTimeFormatted: "2020-02-20T10:01:57.575Z",
                    creationTimeMilli: 1582192917575,
                    dsRevisionId: "5e4e59152e016f0001046c30",
                    labels: [],
                    username: "shmulika@qwilt.com",
                  },
                  {
                    creationTimeFormatted: "2020-02-18T13:02:11.517Z",
                    creationTimeMilli: 1582030931517,
                    dsRevisionId: "5e4be05311f31c00014b6a07",
                    labels: ["shmulika-mutli-region"],
                    username: "shmulika@qwilt.com",
                  },
                  {
                    creationTimeFormatted: "2020-02-18T12:43:43.161Z",
                    creationTimeMilli: 1582029823161,
                    dsRevisionId: "5e4bdbff11f31c00014b6a06",
                    labels: [],
                    username: "shmulika@qwilt.com",
                  },
                  {
                    creationTimeFormatted: "2020-02-18T10:29:54.370Z",
                    creationTimeMilli: 1582021794370,
                    dsRevisionId: "5e4bbca211f31c00014b6a05",
                    labels: [],
                    username: "shmulika@qwilt.com",
                  },
                  {
                    creationTimeFormatted: "2020-02-18T09:40:52.525Z",
                    creationTimeMilli: 1582018852525,
                    dsRevisionId: "5e4bb12411f31c00014b6a01",
                    labels: ["shmulik-usa-region"],
                    username: "shmulika@qwilt.com",
                  },
                  {
                    creationTimeFormatted: "2020-02-18T09:32:38.261Z",
                    creationTimeMilli: 1582018358261,
                    dsRevisionId: "5e4baf3611f31c00014b6a00",
                    labels: [],
                    username: "shmulika@qwilt.com",
                  },
                  {
                    creationTimeFormatted: "2020-02-13T12:49:29.746Z",
                    creationTimeMilli: 1581598169746,
                    dsRevisionId: "5e4545d9bf02b300018a40ae",
                    labels: [],
                    username: "shmulika@qwilt.com",
                  },
                  {
                    creationTimeFormatted: "2020-02-13T12:12:11.217Z",
                    creationTimeMilli: 1581595931217,
                    dsRevisionId: "5e453d1bbf02b300018a40ad",
                    labels: [],
                    username: "shmulika@qwilt.com",
                  },
                  {
                    creationTimeFormatted: "2020-02-12T12:47:30.793Z",
                    creationTimeMilli: 1581511650793,
                    dsRevisionId: "5e43f3e260ae9d000145ec27",
                    labels: [],
                    username: "ofirh@qwilt.com",
                  },
                  {
                    creationTimeFormatted: "2020-02-12T12:47:05.901Z",
                    creationTimeMilli: 1581511625901,
                    dsRevisionId: "5e43f3c960ae9d000145ec26",
                    labels: [],
                    username: "ofirh@qwilt.com",
                  },
                  {
                    creationTimeFormatted: "2020-02-06T15:30:25.906Z",
                    creationTimeMilli: 1581003025906,
                    dsRevisionId: "5e3c31119877620001b1b260",
                    labels: ["test"],
                    username: "amiry@qwilt.com",
                  },
                  {
                    creationTimeFormatted: "2020-02-06T15:28:13.585Z",
                    creationTimeMilli: 1581002893585,
                    dsRevisionId: "5e3c308d9877620001b1b25f",
                    labels: [],
                    username: "amiry@qwilt.com",
                  },
                ],
                isActive: true,
                name: "opencachehub",
                ownerOrgId: "devorg",
                userData: null,
              },
            },
          },
          { dsNameById: { [dsId]: "opencachehub" } }
        );
        // Segment - Network
        expect(segments).toHaveLength(1);
        const segment = segments[0];
        expect(segment).toMatchObject({
          type: type,
          id: `DS/${dsId}`,
          name: "DS - opencachehub",
          changeCount: 0,
          content: {
            kind: "known",
          },
        });
      });
      it("ds details", async function () {
        const listName = ListNameEnum.DS_DETAILS;
        const listType = ContextDiffEntityTypeEnum.DS;

        const itemId = "1234";
        const itemName = "ITEM_NAME";
        const itemData = { randomData: 123 };
        const dsId = `5e3c30469877620001b1b25e`;

        const segments = await getContextDiffSegmentsProviderResult({
          [`DS/${dsId}`]: {
            ["https://cdn-i-delivery-services.rnd.cqloud.com/api/4/delivery-services/5e3c30469877620001b1b25e"]: {
              apiVersion: "4.0.0",
              description: "",
              dsId: itemId,
              dsRevisionDescriptions: [
                {
                  creationTimeFormatted: "2020-09-29T18:38:26.031Z",
                  creationTimeMilli: 1601404706031,
                  dsRevisionId: "5f737f226f56800001fe4280",
                  labels: [],
                  username: "ofirh@qwilt.com",
                },
              ],
              isActive: true,
              name: itemName,
              ownerOrgId: "devorg",
              userData: null,
              ...itemData,
            },
          },
        });
        const segmentChildren = segments[0].content.children as ContextDiffListEntity[];

        // List
        const list = segmentChildren.find((item) => item.name === listName) as ContextDiffListEntity;
        expect(list).toMatchObject({
          type: listType,
          name: listName,
          modifiedCount: 0,
          addedCount: 0,
          removedCount: 0,
          content: {
            kind: "known",
          },
        });
        const listChildren = list.content.children;

        // Items
        const item = listChildren.find((item) => item.name === itemName)!;
        expect(item).toMatchObject({
          type: listType,
          id: itemId,
          diff: {
            // Verify there is some data
            left: { ...itemData },
            right: { ...itemData },
          },
        });
        expect(item.diff.changesAmount).toEqual(0);
      });
      it("label mapping", async function () {
        const listName = ListNameEnum.DS_REVISION_LABEL;
        const listType = ContextDiffEntityTypeEnum.DS_REVISION_LABEL;

        const itemId = "1234";
        const itemName = "ITEM_NAME";
        const itemData = { [itemName]: itemId };
        const dsId = `5e3c30469877620001b1b25e`;

        const segments = await getContextDiffSegmentsProviderResult({
          [`DS/${dsId}`]: {
            "https://cdn-i-delivery-services.rnd.cqloud.com/api/4/delivery-services/5e3c30469877620001b1b25e/label-mapping": {
              GA: "5ee8cbfba8997a0001c53542",
              "ofir-stable": "5f731b9c6f56800001fe427d",
              "ofir-stable+https": "5f0449ced8e99e0001883946",
              [itemName]: itemId,
              "royr-service-tokens": "5ee507d0438a130001e4d026",
              "shmulik-usa-region": "5e4bb12411f31c00014b6a01",
              "shmulika-mutli-region": "5e4be05311f31c00014b6a07",
              stable: "5ea0530f63436d00010eae61",
              test: "5e3c31119877620001b1b260",
            },
          },
        });
        const segmentChildren = segments[0].content.children as ContextDiffListEntity[];

        // List
        const list = segmentChildren.find((item) => item.name === listName) as ContextDiffListEntity;
        expect(list).toMatchObject({
          type: listType,
          name: listName,
          modifiedCount: 0,
          addedCount: 0,
          removedCount: 0,
          content: {
            kind: "known",
          },
        });
        const listChildren = list.content.children;

        // Items
        const item = listChildren.find((item) => item.name === itemName)!;
        expect(item).toMatchObject({
          type: listType,
          id: `${itemName}_${itemId}`,
          diff: {
            // Verify there is some data
            left: { ...itemData },
            right: { ...itemData },
          },
        });
        expect(item.diff.changesAmount).toEqual(0);
      });
      it("revisions", async function () {
        const listName = ListNameEnum.DS_REVISION;
        const listType = ContextDiffEntityTypeEnum.DS_REVISION;

        const itemId = "1234";
        const itemName = "ITEM_NAME";
        const itemData = { randomData: 123 };
        const dsId = `5e3c30469877620001b1b25e`;

        const segments = await getContextDiffSegmentsProviderResult({
          [`DS/${dsId}`]: {
            "https://cdn-i-delivery-services.rnd.cqloud.com/api/4/delivery-services/5e3c30469877620001b1b25e/revisions/5ea0530f63436d00010eae61": {
              apiVersion: "4.0.0",
              components: [
                {
                  classification: {
                    item: {
                      mode: "item",
                      originalPathRegex: "(.*)",
                    },
                  },
                  contentType: "video",
                  identification: {
                    match: {
                      all: [
                        {
                          rule: {
                            originalPathRegex: ".*\\.mp4",
                          },
                        },
                      ],
                    },
                    priority: 10,
                  },
                  name: "opencachehub-vod-prog",
                  redirectRouting: {
                    enabled: true,
                  },
                  serve: {
                    delivery: {
                      headers: {
                        manipulations: [
                          {
                            action: "replaceOrInsert",
                            name: "Access-Control-Allow-Origin",
                            valueFrom: {
                              name: "Origin",
                              source: "clientRequest",
                              type: "header",
                            },
                            when: "always",
                          },
                          {
                            action: "replaceOrInsert",
                            name: "Access-Control-Allow-Credentials",
                            value: "true",
                            when: "always",
                          },
                          {
                            action: "insert",
                            name: "Vary",
                            value: "Origin",
                            when: "always",
                          },
                          {
                            action: "replaceOrInsert",
                            name: "Cache-Control",
                            value: "no-cache",
                            when: "always",
                          },
                        ],
                      },
                    },
                    method: "cache",
                  },
                  tech: {
                    deviceTypeOverride: {
                      cache: {
                        tech: {
                          isComponentForDevice: true,
                          rawConfiguration: {
                            signature: {
                              cgid: 5000,
                              contentAlgorithmName: "first-hit",
                              deliverySessionReuseDirectives: {
                                reuseType: "kForceAllowReuse",
                              },
                              deliverySiteEngineClassificationMode: "kClassifyAndUse",
                              maxDeliveryBwKbps: 1000000,
                              originHeaderHandlingType: "ECHO_AND_CREDENTIALS",
                              shouldDeliveryClassifyCidByDeliverySession: false,
                              shouldDeliveryTakeUriRangeFromDeliverySession: true,
                              shouldReuseDeliverySession: true,
                              siteNameForTopper: "opencachehub-open-caching",
                            },
                            useBuiltinBase: true,
                          },
                        },
                      },
                      httpRouter: {
                        tech: {
                          isComponentForDevice: true,
                        },
                      },
                    },
                  },
                },
              ],
              creationTimeFormatted: itemName,
              creationTimeMilli: 1587565327771,
              dsId: itemId,
              dsRevisionId: "5ea0530f63436d00010eae61",
              httpVersions: ["http/1.1"],
              identification: {
                match: {
                  all: [
                    {
                      rule: {
                        hostnameSuffix: ".opencachehub.http.cdn-i.opencaching.tc-rnd.cqloud.com",
                      },
                    },
                  ],
                },
              },
              manifestRewriteRouting: {
                enabled: false,
              },
              origin: {
                target: {
                  roundRobinSelectionPolicy: {
                    targets: [
                      {
                        hostname: "origin.videos.opencachehub.com",
                        isGlobalDefault: true,
                      },
                      {
                        hostname: "origin.videos.opencachehub.com",
                        regions: [
                          {
                            name: "country:USA",
                          },
                        ],
                      },
                      {
                        hostname: "america-origin.videos.opencachehub.com",
                        regions: [
                          {
                            name: "region:America",
                          },
                        ],
                      },
                      {
                        hostname: "emea-origin.videos.opencachehub.com",
                        regions: [
                          {
                            name: "region:LATAM",
                          },
                        ],
                      },
                      {
                        hostname: "africa-origin.videos.opencachehub.com",
                        regions: [
                          {
                            name: "region:Africa2",
                          },
                        ],
                      },
                    ],
                  },
                  selectionPolicy: "roundRobin",
                },
              },
              ownerOrgId: "devorg",
              protocols: ["http"],
              redirectHttpToHttps: {
                enabled: false,
              },
              redirectRouting: {
                enabled: true,
              },
              serviceToken: "opencachehub",
              serviceType: "vod",
              unidentifiedComponent: {
                tech: {
                  deviceTypeOverride: {
                    cache: {
                      tech: {
                        isComponentForDevice: true,
                        rawConfiguration: {
                          signature: {
                            allowDyceFetchingForTransaction: false,
                            cgid: 5000,
                            isIspCdnSignature: true,
                            multiSignatureSearchRank: 0,
                            siteNameForTopper: "opencachehub-open-caching",
                          },
                          useBuiltinBase: true,
                        },
                      },
                    },
                  },
                },
              },
              username: "ofirh@qwilt.com",
              ...itemData,
            },
          },
        });
        const segmentChildren = segments[0].content.children as ContextDiffListEntity[];

        // List
        const list = segmentChildren.find((item) => item.name === listName) as ContextDiffListEntity;
        expect(list).toMatchObject({
          type: listType,
          name: listName,
          modifiedCount: 0,
          addedCount: 0,
          removedCount: 0,
          content: {
            kind: "known",
          },
        });
        const listChildren = list.content.children;

        // Items
        const item = listChildren.find((item) => item.name === itemName)!;
        expect(item).toMatchObject({
          type: listType,
          id: itemId,
          diff: {
            // Verify there is some data
            left: { ...itemData },
            right: { ...itemData },
          },
        });
        expect(item.diff.changesAmount).toEqual(0);
      });
    });
    describe("ds-assignment", function () {
      it("segment details", async function () {
        const type = ContextDiffEntityTypeEnum.DS_ASSIGNMENT;
        const segmentId = "DS-ASSIGNMENTS/2749";
        const networkName = "DS Assignments - Charter";
        const dsId = "5e3c30469877620001b1b25e";

        const segments = await getContextDiffSegmentsProviderResult(
          {
            [segmentId]: {
              "https://cdn-i-ds-assignments.rnd.cqloud.com/api/3/ds-assignments/rules/network?cdnId=cf6988d9-b341-412d-b978-99ccc407cf01&networkId=2749": {
                network: [
                  {
                    cdnId: "cf6988d9-b341-412d-b978-99ccc407cf01",
                    deliveryService: {
                      id: "5e4bb34f11f31c00014b6a02",
                      label: "stable",
                    },
                    enabled: true,
                    networkId: 2749,
                    ruleId: "41c4417d-5d6c-4665-93ed-6cd99ec3e7d6",
                  },
                  {
                    cdnId: "cf6988d9-b341-412d-b978-99ccc407cf01",
                    deliveryService: {
                      id: "5e4e592e2e016f0001046c31",
                      label: "poc",
                    },
                    enabled: true,
                    networkId: 2749,
                    ruleId: "6e56f65b-b9b3-428f-9ac1-1f6bc2625f02",
                  },
                  {
                    cdnId: "cf6988d9-b341-412d-b978-99ccc407cf01",
                    deliveryService: {
                      id: `${dsId}`,
                      label: "stable",
                    },
                    enabled: true,
                    networkId: 2749,
                    ruleId: "ecf010cc-b01d-48bd-8506-c397322ee026",
                  },
                ],
              },
            },
            "NETWORK/2749": {
              "https://cdn-i-qn-deployment.rnd.cqloud.com/api/2/entities?contained_in_list_format=none&contains_list_format=none&entities_list_format=details&ids=2749&types=network": {
                entities: [
                  {
                    attributes: {},
                    id: 2749,
                    name: networkName,
                    type: "network",
                    uniqueName: "rgnAmerica_cnUsa_nwkCharter",
                  },
                ],
              },
            },
          },
          { networkNameById: { "2749": "Charter" } }
        );
        // Segment - Network
        expect(segments).toHaveLength(2);
        const segment = segments.find((segment) => segment.id === segmentId);
        expect(segment).toMatchObject({
          type: type,
          id: segmentId,
          changeCount: 0,
          content: {
            kind: "known",
          },
        });
        expect(segment!.name).toMatch(networkName);
      });
      it("network assignments", async function () {
        const listName = ListNameEnum.DS_ASSIGNMENT_NETWORK;
        const listType = ContextDiffEntityTypeEnum.DS_ASSIGNMENT_NETWORK;

        const itemId = "1234";
        const dsName = "myDs";
        const dsId = "DS_ID";
        const itemData = { randomData: 123 };

        const segments = await getContextDiffSegmentsProviderResult({
          "DS-ASSIGNMENTS/2757": {
            "https://cdn-i-ds-assignments.rnd.cqloud.com/api/3/ds-assignments/rules/network?cdnId=cf6988d9-b341-412d-b978-99ccc407cf01&networkId=2749": {
              network: [
                {
                  cdnId: "cf6988d9-b341-412d-b978-99ccc407cf01",
                  deliveryService: {
                    id: dsId,
                    label: "stable",
                  },
                  enabled: true,
                  networkId: 2749,
                  ruleId: itemId,
                  ...itemData,
                },
                {
                  cdnId: "cf6988d9-b341-412d-b978-99ccc407cf01",
                  deliveryService: {
                    id: "5e4e592e2e016f0001046c31",
                    label: "poc",
                  },
                  enabled: true,
                  networkId: 2749,
                  ruleId: "6e56f65b-b9b3-428f-9ac1-1f6bc2625f02",
                },
                {
                  cdnId: "cf6988d9-b341-412d-b978-99ccc407cf01",
                  deliveryService: {
                    id: `${dsId}`,
                    label: "stable",
                  },
                  enabled: true,
                  networkId: 2749,
                  ruleId: "ecf010cc-b01d-48bd-8506-c397322ee026",
                },
              ],
            },
          },
          // For ID replacement test
          "NETWORK/2749": {
            "https://cdn-i-qn-deployment.rnd.cqloud.com/api/2/entities?contained_in_list_format=none&contains_list_format=none&entities_list_format=details&ids=2749&types=network": {
              entities: [
                {
                  attributes: {},
                  id: 2749,
                  name: "Charter",
                  type: "network",
                  uniqueName: "rgnAmerica_cnUsa_nwkCharter",
                },
              ],
            },
          },
          ["DS/" + dsId]: {
            ["https://cdn-i-delivery-services.rnd.cqloud.com/api/4/delivery-services/" + dsId]: {
              apiVersion: "4.0.0",
              description: "Test g2o keys on top of Opencachehub DS",
              dsId: dsId,
              dsRevisionDescriptions: [
                {
                  creationTimeFormatted: "2020-02-21T17:38:52.106Z",
                  creationTimeMilli: 1582306732106,
                  dsRevisionId: "5e5015ac0e4dbf0001d4edc0",
                  labels: ["stable"],
                  username: "shmulika@qwilt.com",
                },
                {
                  creationTimeFormatted: "2020-02-18T10:11:30.709Z",
                  creationTimeMilli: 1582020690709,
                  dsRevisionId: "5e4bb85211f31c00014b6a04",
                  labels: [],
                  username: "amiry@qwilt.com",
                },
                {
                  creationTimeFormatted: "2020-02-18T10:00:02.902Z",
                  creationTimeMilli: 1582020002902,
                  dsRevisionId: "5e4bb5a211f31c00014b6a03",
                  labels: [],
                  username: "amiry@qwilt.com",
                },
              ],
              isActive: true,
              name: dsName,
              ownerOrgId: "devorg",
              userData: null,
            },
          },
        });
        const segmentChildren = segments[0].content.children as ContextDiffListEntity[];

        // List
        const list = segmentChildren.find((item) => item.name === listName) as ContextDiffListEntity;
        expect(list).toMatchObject({
          type: listType,
          name: listName,
          modifiedCount: 0,
          addedCount: 0,
          removedCount: 0,
          content: {
            kind: "known",
          },
        });
        const listChildren = list.content.children;

        // Items
        const item = listChildren.find((item) => item.id === itemId)!;
        expect(item).toMatchObject({
          type: listType,
          id: itemId,
          diff: {
            // Verify there is some data
            left: { ...itemData },
            right: { ...itemData },
          },
        });
        expect(item.name).toMatch(dsId);
        const right = item.diff.right! as UnknownObject;
        expect(right.deliveryService["id_debugFriendyName"]).toMatch(dsName);
        expect(item.diff.changesAmount).toEqual(0);
      });
      it("du assignments", async function () {
        const listName = ListNameEnum.DS_ASSIGNMENT_CACHE;
        const listType = ContextDiffEntityTypeEnum.DS_ASSIGNMENT_CACHE;

        const itemId = "31baa1ee-8525-4556-a450-3edfc885a84f";
        const itemData = { randomData: 123 };
        const cacheName = "myCache";
        const dsName = "myDs";
        const dsId = `5e3c30469877620001b1b25e`;
        const cacheId = "31baa1ee-8525-4556-a450-3edfc885a85f";

        const segments = await getContextDiffSegmentsProviderResult({
          "DS-ASSIGNMENTS/2757": {
            "https://cdn-i-ds-assignments.rnd.cqloud.com/api/3/ds-assignments/rules/delivery-unit?cdnId=cf6988d9-b341-412d-b978-99ccc407cf01&networkId=2757": {
              deliveryUnit: [
                {
                  assignmentBlocked: false,
                  cdnId: "cf6988d9-b341-412d-b978-99ccc407cf01",
                  deliveryService: {
                    id: `${dsId}`,
                    label: "stable",
                  },
                  deliveryUnitId: cacheId,
                  enabled: true,
                  networkId: 2757,
                  ruleId: itemId,
                  ...itemData,
                },
              ],
            },
          },
          // For IDs replacement
          [`DS/${dsId}`]: {
            ["https://cdn-i-delivery-services.rnd.cqloud.com/api/4/delivery-services/5e3c30469877620001b1b25e"]: {
              apiVersion: "4.0.0",
              description: "",
              dsId: `${dsId}`,
              dsRevisionDescriptions: [
                {
                  creationTimeFormatted: "2020-09-29T18:38:26.031Z",
                  creationTimeMilli: 1601404706031,
                  dsRevisionId: "5f737f226f56800001fe4280",
                  labels: [],
                  username: "ofirh@qwilt.com",
                },
                {
                  creationTimeFormatted: "2020-09-29T11:33:48.102Z",
                  creationTimeMilli: 1601379228102,
                  dsRevisionId: "5f731b9c6f56800001fe427d",
                  labels: ["ofir-stable"],
                  username: "ofirh@qwilt.com",
                },
                {
                  creationTimeFormatted: "2020-09-29T11:24:46.791Z",
                  creationTimeMilli: 1601378686791,
                  dsRevisionId: "5f73197e6f56800001fe427c",
                  labels: [],
                  username: "ofirh@qwilt.com",
                },
                {
                  creationTimeFormatted: "2020-07-07T10:09:18.079Z",
                  creationTimeMilli: 1594116558079,
                  dsRevisionId: "5f0449ced8e99e0001883946",
                  labels: ["ofir-stable+https"],
                  username: "guyk@qwilt.com",
                },
                {
                  creationTimeFormatted: "2020-06-16T13:41:14.963Z",
                  creationTimeMilli: 1592314874963,
                  dsRevisionId: "5ee8cbfba8997a0001c53542",
                  labels: ["GA", "royr-no-service-token-error"],
                  username: "royr@qwilt.com",
                },
                {
                  creationTimeFormatted: "2020-06-13T17:07:28.213Z",
                  creationTimeMilli: 1592068048213,
                  dsRevisionId: "5ee507d0438a130001e4d026",
                  labels: ["royr-service-tokens"],
                  username: "royr@qwilt.com",
                },
                {
                  creationTimeFormatted: "2020-06-13T16:48:39.385Z",
                  creationTimeMilli: 1592066919385,
                  dsRevisionId: "5ee50367438a130001e4d025",
                  labels: [],
                  username: "royr@qwilt.com",
                },
                {
                  creationTimeFormatted: "2020-06-11T07:32:24.107Z",
                  creationTimeMilli: 1591860744107,
                  dsRevisionId: "5ee1de08438a130001e4d021",
                  labels: [],
                  username: "royr@qwilt.com",
                },
                {
                  creationTimeFormatted: "2020-06-11T07:31:51.381Z",
                  creationTimeMilli: 1591860711381,
                  dsRevisionId: "5ee1dde7438a130001e4d020",
                  labels: [],
                  username: "royr@qwilt.com",
                },
                {
                  creationTimeFormatted: "2020-06-11T07:25:37.479Z",
                  creationTimeMilli: 1591860337479,
                  dsRevisionId: "5ee1dc71438a130001e4d01f",
                  labels: [],
                  username: "royr@qwilt.com",
                },
                {
                  creationTimeFormatted: "2020-06-11T07:07:47.863Z",
                  creationTimeMilli: 1591859267863,
                  dsRevisionId: "5ee1d843438a130001e4d01e",
                  labels: [],
                  username: "royr@qwilt.com",
                },
                {
                  creationTimeFormatted: "2020-06-07T11:53:23.684Z",
                  creationTimeMilli: 1591530803684,
                  dsRevisionId: "5edcd5332657800001c1e25b",
                  labels: [],
                  username: "royr@qwilt.com",
                },
                {
                  creationTimeFormatted: "2020-04-22T14:27:16.041Z",
                  creationTimeMilli: 1587565636041,
                  dsRevisionId: "5ea0544463436d00010eae62",
                  labels: [],
                  username: "ofirh@qwilt.com",
                },
                {
                  creationTimeFormatted: "2020-04-22T14:22:07.771Z",
                  creationTimeMilli: 1587565327771,
                  dsRevisionId: "5ea0530f63436d00010eae61",
                  labels: ["stable"],
                  username: "ofirh@qwilt.com",
                },
                {
                  creationTimeFormatted: "2020-04-22T10:48:12.337Z",
                  creationTimeMilli: 1587552492337,
                  dsRevisionId: "5ea020ec63436d00010eae60",
                  labels: [],
                  username: "ofirh@qwilt.com",
                },
                {
                  creationTimeFormatted: "2020-04-22T10:31:30.567Z",
                  creationTimeMilli: 1587551490567,
                  dsRevisionId: "5ea01d0263436d00010eae5f",
                  labels: [],
                  username: "ofirh@qwilt.com",
                },
                {
                  creationTimeFormatted: "2020-04-21T13:32:51.256Z",
                  creationTimeMilli: 1587475971256,
                  dsRevisionId: "5e9ef60363436d00010eae5e",
                  labels: [],
                  username: "ofirh@qwilt.com",
                },
                {
                  creationTimeFormatted: "2020-02-20T10:01:57.575Z",
                  creationTimeMilli: 1582192917575,
                  dsRevisionId: "5e4e59152e016f0001046c30",
                  labels: [],
                  username: "shmulika@qwilt.com",
                },
                {
                  creationTimeFormatted: "2020-02-18T13:02:11.517Z",
                  creationTimeMilli: 1582030931517,
                  dsRevisionId: "5e4be05311f31c00014b6a07",
                  labels: ["shmulika-mutli-region"],
                  username: "shmulika@qwilt.com",
                },
                {
                  creationTimeFormatted: "2020-02-18T12:43:43.161Z",
                  creationTimeMilli: 1582029823161,
                  dsRevisionId: "5e4bdbff11f31c00014b6a06",
                  labels: [],
                  username: "shmulika@qwilt.com",
                },
                {
                  creationTimeFormatted: "2020-02-18T10:29:54.370Z",
                  creationTimeMilli: 1582021794370,
                  dsRevisionId: "5e4bbca211f31c00014b6a05",
                  labels: [],
                  username: "shmulika@qwilt.com",
                },
                {
                  creationTimeFormatted: "2020-02-18T09:40:52.525Z",
                  creationTimeMilli: 1582018852525,
                  dsRevisionId: "5e4bb12411f31c00014b6a01",
                  labels: ["shmulik-usa-region"],
                  username: "shmulika@qwilt.com",
                },
                {
                  creationTimeFormatted: "2020-02-18T09:32:38.261Z",
                  creationTimeMilli: 1582018358261,
                  dsRevisionId: "5e4baf3611f31c00014b6a00",
                  labels: [],
                  username: "shmulika@qwilt.com",
                },
                {
                  creationTimeFormatted: "2020-02-13T12:49:29.746Z",
                  creationTimeMilli: 1581598169746,
                  dsRevisionId: "5e4545d9bf02b300018a40ae",
                  labels: [],
                  username: "shmulika@qwilt.com",
                },
                {
                  creationTimeFormatted: "2020-02-13T12:12:11.217Z",
                  creationTimeMilli: 1581595931217,
                  dsRevisionId: "5e453d1bbf02b300018a40ad",
                  labels: [],
                  username: "shmulika@qwilt.com",
                },
                {
                  creationTimeFormatted: "2020-02-12T12:47:30.793Z",
                  creationTimeMilli: 1581511650793,
                  dsRevisionId: "5e43f3e260ae9d000145ec27",
                  labels: [],
                  username: "ofirh@qwilt.com",
                },
                {
                  creationTimeFormatted: "2020-02-12T12:47:05.901Z",
                  creationTimeMilli: 1581511625901,
                  dsRevisionId: "5e43f3c960ae9d000145ec26",
                  labels: [],
                  username: "ofirh@qwilt.com",
                },
                {
                  creationTimeFormatted: "2020-02-06T15:30:25.906Z",
                  creationTimeMilli: 1581003025906,
                  dsRevisionId: "5e3c31119877620001b1b260",
                  labels: ["test"],
                  username: "amiry@qwilt.com",
                },
                {
                  creationTimeFormatted: "2020-02-06T15:28:13.585Z",
                  creationTimeMilli: 1581002893585,
                  dsRevisionId: "5e3c308d9877620001b1b25f",
                  labels: [],
                  username: "amiry@qwilt.com",
                },
              ],
              isActive: true,
              name: dsName,
              ownerOrgId: "devorg",
              userData: null,
            },
          },
          "NETWORK/2757": {
            "https://cdn-i-cdns.rnd.cqloud.com/api/1/cdns/cf6988d9-b341-412d-b978-99ccc407cf01/delivery-units?network_id=2757": {
              _links: {
                self: {
                  href:
                    "http://cdn-i-cdns.rnd.cqloud.com/api/1.0.0/cdns/cf6988d9-b341-412d-b978-99ccc407cf01/delivery-units?network_id=2757",
                },
              },
              deliveryUnits: [
                {
                  _links: {
                    self: {
                      href:
                        "http://cdn-i-cdns.rnd.cqloud.com/api/1.0.0/cdns/cf6988d9-b341-412d-b978-99ccc407cf01/delivery-units/31baa1ee-8525-4556-a450-3edfc885a85f",
                    },
                  },
                  cacheHashId: "",
                  cdnId: "cf6988d9-b341-412d-b978-99ccc407cf01",
                  deliveryUnitId: cacheId,
                  deliveryUnitInterfaces: {},
                  duGroupId: "01921d3d-0a9b-4c5d-a51e-abf624ce5fd9",
                  healthConnectionTimeoutMs: 2000,
                  healthHistoryCount: 30,
                  healthMaxLoadAverage: 25,
                  healthMaxQueryTimeMs: 2000,
                  healthMinAvailableBwKbps: 0,
                  healthMinAvailableBwKbpsEnabled: false,
                  healthPollUrlTemplate: null,
                  healthReportTimeMs: 200,
                  healthRequestTimeWarnMs: 100,
                  healthRequestTimeoutMs: 400,
                  healthSampleTimeMs: 1000,
                  monitoringSegmentId: "amiry-test-1",
                  name: cacheName,
                  networkId: 2757,
                  numericId: 37,
                  operationalMode: "offline",
                  systemId: "amiry-qn-new",
                },
              ],
            },
          },
        });
        const segmentChildren = segments[0].content.children as ContextDiffListEntity[];

        // List
        const list = segmentChildren.find((item) => item.name === listName) as ContextDiffListEntity;
        expect(list).toMatchObject({
          type: listType,
          name: listName,
          modifiedCount: 0,
          addedCount: 0,
          removedCount: 0,
          content: {
            kind: "known",
          },
        });
        const listChildren = list.content.children;

        // Items
        const item = listChildren.find((item) => item.id === itemId)!;
        expect(item).toMatchObject({
          type: listType,
          id: itemId,
          diff: {
            // Verify there is some data
            left: { ...itemData },
            right: { ...itemData },
          },
        });
        expect(item.name).toMatch(new RegExp(dsId + "$"));
        expect(item.name).toMatch(cacheId);
        expect(item.diff.changesAmount).toEqual(0);
      });
      it("du assignments - ds with query param", async function () {
        const listName = ListNameEnum.DS_ASSIGNMENT_CACHE;
        const listType = ContextDiffEntityTypeEnum.DS_ASSIGNMENT_CACHE;

        const itemId = "31baa1ee-8525-4556-a450-3edfc885a84f";
        const itemData = { randomData: 123 };
        const cacheName = "myCache";
        const dsName = "myDs";
        const dsId = `5e3c30469877620001b1b25e`;
        const cacheId = "31baa1ee-8525-4556-a450-3edfc885a85f";

        const segments = await getContextDiffSegmentsProviderResult({
          "DS-ASSIGNMENTS/2757": {
            "https://cdn-i-ds-assignments.rnd.cqloud.com/api/3/ds-assignments/rules/delivery-unit?cdnId=cf6988d9-b341-412d-b978-99ccc407cf01&networkId=2757": {
              deliveryUnit: [
                {
                  assignmentBlocked: false,
                  cdnId: "cf6988d9-b341-412d-b978-99ccc407cf01",
                  deliveryService: {
                    id: `${dsId}`,
                    label: "stable",
                  },
                  deliveryUnitId: cacheId,
                  enabled: true,
                  networkId: 2757,
                  ruleId: itemId,
                  ...itemData,
                },
              ],
            },
          },
          // For IDs replacement
          [`DS/${dsId}`]: {
            "https://cdn-i-delivery-services.rnd.cqloud.com/api/4/delivery-services/5e3c30469877620001b1b25e?revision-description=false": {
              apiVersion: "4.0.0",
              description: "",
              dsId: `${dsId}`,
              dsRevisionDescriptions: [
                {
                  creationTimeFormatted: "2020-09-29T18:38:26.031Z",
                  creationTimeMilli: 1601404706031,
                  dsRevisionId: "5f737f226f56800001fe4280",
                  labels: [],
                  username: "ofirh@qwilt.com",
                },
                {
                  creationTimeFormatted: "2020-09-29T11:33:48.102Z",
                  creationTimeMilli: 1601379228102,
                  dsRevisionId: "5f731b9c6f56800001fe427d",
                  labels: ["ofir-stable"],
                  username: "ofirh@qwilt.com",
                },
                {
                  creationTimeFormatted: "2020-09-29T11:24:46.791Z",
                  creationTimeMilli: 1601378686791,
                  dsRevisionId: "5f73197e6f56800001fe427c",
                  labels: [],
                  username: "ofirh@qwilt.com",
                },
                {
                  creationTimeFormatted: "2020-07-07T10:09:18.079Z",
                  creationTimeMilli: 1594116558079,
                  dsRevisionId: "5f0449ced8e99e0001883946",
                  labels: ["ofir-stable+https"],
                  username: "guyk@qwilt.com",
                },
                {
                  creationTimeFormatted: "2020-06-16T13:41:14.963Z",
                  creationTimeMilli: 1592314874963,
                  dsRevisionId: "5ee8cbfba8997a0001c53542",
                  labels: ["GA", "royr-no-service-token-error"],
                  username: "royr@qwilt.com",
                },
                {
                  creationTimeFormatted: "2020-06-13T17:07:28.213Z",
                  creationTimeMilli: 1592068048213,
                  dsRevisionId: "5ee507d0438a130001e4d026",
                  labels: ["royr-service-tokens"],
                  username: "royr@qwilt.com",
                },
                {
                  creationTimeFormatted: "2020-06-13T16:48:39.385Z",
                  creationTimeMilli: 1592066919385,
                  dsRevisionId: "5ee50367438a130001e4d025",
                  labels: [],
                  username: "royr@qwilt.com",
                },
                {
                  creationTimeFormatted: "2020-06-11T07:32:24.107Z",
                  creationTimeMilli: 1591860744107,
                  dsRevisionId: "5ee1de08438a130001e4d021",
                  labels: [],
                  username: "royr@qwilt.com",
                },
                {
                  creationTimeFormatted: "2020-06-11T07:31:51.381Z",
                  creationTimeMilli: 1591860711381,
                  dsRevisionId: "5ee1dde7438a130001e4d020",
                  labels: [],
                  username: "royr@qwilt.com",
                },
                {
                  creationTimeFormatted: "2020-06-11T07:25:37.479Z",
                  creationTimeMilli: 1591860337479,
                  dsRevisionId: "5ee1dc71438a130001e4d01f",
                  labels: [],
                  username: "royr@qwilt.com",
                },
                {
                  creationTimeFormatted: "2020-06-11T07:07:47.863Z",
                  creationTimeMilli: 1591859267863,
                  dsRevisionId: "5ee1d843438a130001e4d01e",
                  labels: [],
                  username: "royr@qwilt.com",
                },
                {
                  creationTimeFormatted: "2020-06-07T11:53:23.684Z",
                  creationTimeMilli: 1591530803684,
                  dsRevisionId: "5edcd5332657800001c1e25b",
                  labels: [],
                  username: "royr@qwilt.com",
                },
                {
                  creationTimeFormatted: "2020-04-22T14:27:16.041Z",
                  creationTimeMilli: 1587565636041,
                  dsRevisionId: "5ea0544463436d00010eae62",
                  labels: [],
                  username: "ofirh@qwilt.com",
                },
                {
                  creationTimeFormatted: "2020-04-22T14:22:07.771Z",
                  creationTimeMilli: 1587565327771,
                  dsRevisionId: "5ea0530f63436d00010eae61",
                  labels: ["stable"],
                  username: "ofirh@qwilt.com",
                },
                {
                  creationTimeFormatted: "2020-04-22T10:48:12.337Z",
                  creationTimeMilli: 1587552492337,
                  dsRevisionId: "5ea020ec63436d00010eae60",
                  labels: [],
                  username: "ofirh@qwilt.com",
                },
                {
                  creationTimeFormatted: "2020-04-22T10:31:30.567Z",
                  creationTimeMilli: 1587551490567,
                  dsRevisionId: "5ea01d0263436d00010eae5f",
                  labels: [],
                  username: "ofirh@qwilt.com",
                },
                {
                  creationTimeFormatted: "2020-04-21T13:32:51.256Z",
                  creationTimeMilli: 1587475971256,
                  dsRevisionId: "5e9ef60363436d00010eae5e",
                  labels: [],
                  username: "ofirh@qwilt.com",
                },
                {
                  creationTimeFormatted: "2020-02-20T10:01:57.575Z",
                  creationTimeMilli: 1582192917575,
                  dsRevisionId: "5e4e59152e016f0001046c30",
                  labels: [],
                  username: "shmulika@qwilt.com",
                },
                {
                  creationTimeFormatted: "2020-02-18T13:02:11.517Z",
                  creationTimeMilli: 1582030931517,
                  dsRevisionId: "5e4be05311f31c00014b6a07",
                  labels: ["shmulika-mutli-region"],
                  username: "shmulika@qwilt.com",
                },
                {
                  creationTimeFormatted: "2020-02-18T12:43:43.161Z",
                  creationTimeMilli: 1582029823161,
                  dsRevisionId: "5e4bdbff11f31c00014b6a06",
                  labels: [],
                  username: "shmulika@qwilt.com",
                },
                {
                  creationTimeFormatted: "2020-02-18T10:29:54.370Z",
                  creationTimeMilli: 1582021794370,
                  dsRevisionId: "5e4bbca211f31c00014b6a05",
                  labels: [],
                  username: "shmulika@qwilt.com",
                },
                {
                  creationTimeFormatted: "2020-02-18T09:40:52.525Z",
                  creationTimeMilli: 1582018852525,
                  dsRevisionId: "5e4bb12411f31c00014b6a01",
                  labels: ["shmulik-usa-region"],
                  username: "shmulika@qwilt.com",
                },
                {
                  creationTimeFormatted: "2020-02-18T09:32:38.261Z",
                  creationTimeMilli: 1582018358261,
                  dsRevisionId: "5e4baf3611f31c00014b6a00",
                  labels: [],
                  username: "shmulika@qwilt.com",
                },
                {
                  creationTimeFormatted: "2020-02-13T12:49:29.746Z",
                  creationTimeMilli: 1581598169746,
                  dsRevisionId: "5e4545d9bf02b300018a40ae",
                  labels: [],
                  username: "shmulika@qwilt.com",
                },
                {
                  creationTimeFormatted: "2020-02-13T12:12:11.217Z",
                  creationTimeMilli: 1581595931217,
                  dsRevisionId: "5e453d1bbf02b300018a40ad",
                  labels: [],
                  username: "shmulika@qwilt.com",
                },
                {
                  creationTimeFormatted: "2020-02-12T12:47:30.793Z",
                  creationTimeMilli: 1581511650793,
                  dsRevisionId: "5e43f3e260ae9d000145ec27",
                  labels: [],
                  username: "ofirh@qwilt.com",
                },
                {
                  creationTimeFormatted: "2020-02-12T12:47:05.901Z",
                  creationTimeMilli: 1581511625901,
                  dsRevisionId: "5e43f3c960ae9d000145ec26",
                  labels: [],
                  username: "ofirh@qwilt.com",
                },
                {
                  creationTimeFormatted: "2020-02-06T15:30:25.906Z",
                  creationTimeMilli: 1581003025906,
                  dsRevisionId: "5e3c31119877620001b1b260",
                  labels: ["test"],
                  username: "amiry@qwilt.com",
                },
                {
                  creationTimeFormatted: "2020-02-06T15:28:13.585Z",
                  creationTimeMilli: 1581002893585,
                  dsRevisionId: "5e3c308d9877620001b1b25f",
                  labels: [],
                  username: "amiry@qwilt.com",
                },
              ],
              isActive: true,
              name: dsName,
              ownerOrgId: "devorg",
              userData: null,
            },
          },
          "NETWORK/2757": {
            "https://cdn-i-cdns.rnd.cqloud.com/api/1/cdns/cf6988d9-b341-412d-b978-99ccc407cf01/delivery-units?network_id=2757": {
              _links: {
                self: {
                  href:
                    "http://cdn-i-cdns.rnd.cqloud.com/api/1.0.0/cdns/cf6988d9-b341-412d-b978-99ccc407cf01/delivery-units?network_id=2757",
                },
              },
              deliveryUnits: [
                {
                  _links: {
                    self: {
                      href:
                        "http://cdn-i-cdns.rnd.cqloud.com/api/1.0.0/cdns/cf6988d9-b341-412d-b978-99ccc407cf01/delivery-units/31baa1ee-8525-4556-a450-3edfc885a85f",
                    },
                  },
                  cacheHashId: "",
                  cdnId: "cf6988d9-b341-412d-b978-99ccc407cf01",
                  deliveryUnitId: cacheId,
                  deliveryUnitInterfaces: {},
                  duGroupId: "01921d3d-0a9b-4c5d-a51e-abf624ce5fd9",
                  healthConnectionTimeoutMs: 2000,
                  healthHistoryCount: 30,
                  healthMaxLoadAverage: 25,
                  healthMaxQueryTimeMs: 2000,
                  healthMinAvailableBwKbps: 0,
                  healthMinAvailableBwKbpsEnabled: false,
                  healthPollUrlTemplate: null,
                  healthReportTimeMs: 200,
                  healthRequestTimeWarnMs: 100,
                  healthRequestTimeoutMs: 400,
                  healthSampleTimeMs: 1000,
                  monitoringSegmentId: "amiry-test-1",
                  name: cacheName,
                  networkId: 2757,
                  numericId: 37,
                  operationalMode: "offline",
                  systemId: "amiry-qn-new",
                },
              ],
            },
          },
        });
        const segmentChildren = segments[0].content.children as ContextDiffListEntity[];

        // List
        const list = segmentChildren.find((item) => item.name === listName) as ContextDiffListEntity;
        expect(list).toMatchObject({
          type: listType,
          name: listName,
          modifiedCount: 0,
          addedCount: 0,
          removedCount: 0,
          content: {
            kind: "known",
          },
        });
        const listChildren = list.content.children;

        // Items
        const item = listChildren.find((item) => item.id === itemId)!;
        expect(item).toMatchObject({
          type: listType,
          id: itemId,
          diff: {
            // Verify there is some data
            left: { ...itemData },
            right: { ...itemData },
          },
        });
        expect(item.name).toMatch(dsId);
        expect(item.name).toMatch(cacheId);
        expect(item.diff.changesAmount).toEqual(0);
      });
    });
    describe("cdn", function () {
      it("segment details", async function () {
        const type = ContextDiffEntityTypeEnum.CDN;
        const segmentId = "CDN";
        const segmentName = "AwesomeCDN";

        const listName = ListNameEnum.CDN_DETAILS;
        const listType = ContextDiffEntityTypeEnum.CDN;

        const itemId = "1234";
        const itemName = segmentName;
        const itemData = { randomData: 123 };

        const segments = await getContextDiffSegmentsProviderResult({
          [segmentId]: {
            "https://cdn-i-cdns.rnd.cqloud.com/api/1/cdns/cf6988d9-b341-412d-b978-99ccc407cf01": {
              _links: {
                self: {
                  href: "http://cdn-i-cdns.rnd.cqloud.com/api/1.0.0/cdns/cf6988d9-b341-412d-b978-99ccc407cf01",
                },
              },
              cdnId: itemId,
              description: "",
              dnsCdnSubDomain: "",
              dnsRootHostedZone: "amiry-cdn.cqloud.com",
              dnsSubDomain: "",
              httpCdnSubDomain: "",
              httpRootHostedZone: "amiry-cdn.cqloud.com",
              httpSubDomain: "",
              name: segmentName,
              operationalDomain: null,
              ...itemData,
            },
          },
        });

        // Segment - Network
        expect(segments).toHaveLength(1);
        const segment = segments.find((segment) => segment.id === segmentId);
        expect(segment).toMatchObject({
          type: type,
          id: segmentId,
          name: `CDN details`,
          changeCount: 0,
          content: {
            kind: "known",
          },
        });
        const segmentChildren = segments[0].content.children as ContextDiffListEntity[];

        // List
        const list = segmentChildren.find((item) => item.name === listName) as ContextDiffListEntity;
        expect(list).toMatchObject({
          type: listType,
          name: listName,
          modifiedCount: 0,
          addedCount: 0,
          removedCount: 0,
          content: {
            kind: "known",
          },
        });
        const listChildren = list.content.children;

        // Items
        const item = listChildren.find((item) => item.name === itemName)!;
        expect(item).toMatchObject({
          type: listType,
          id: itemId,
          diff: {
            // Verify there is some data
            left: { ...itemData },
            right: { ...itemData },
          },
        });
        expect(item.diff.changesAmount).toEqual(0);
      });
    });
    describe("delegation", function () {
      it("segment details", async function () {
        const type = ContextDiffEntityTypeEnum.DELEGATION;

        const segments = await getContextDiffSegmentsProviderResult({
          DELEGATION: {
            "https://cdn-i-static-dns.rnd.cqloud.com/api/1/records?cdnId=74fc1710-7bee-4291-872d-82883cfaa016": {
              staticDnsResponseList: [
                {
                  cdnId: "74fc1710-7bee-4291-872d-82883cfaa016",
                  deliveryServiceId: "5fa1b7e0d6dcf000019b7ce1",
                  dnsRecordId: "e847b196-6bf5-4156-b2db-241162104353",
                  name: "amiry-test-1",
                  orgId: "devorg",
                  ttl: 1,
                  type: "TXT_RECORD",
                  value: "1",
                },
              ],
            },
          },
        });
        // Segment - Network
        expect(segments).toHaveLength(1);
        const segment = segments[0];
        expect(segment).toMatchObject({
          type: type,
          id: "DELEGATION",
          name: "Delegation",
          changeCount: 0,
          content: {
            kind: "known",
          },
        });
      });
      it("records", async function () {
        const listName = ListNameEnum.DELEGATION_STATIC_DNS_RECORDS;
        const listType = ContextDiffEntityTypeEnum.DELEGATION_STATIC_DNS_RECORD;

        const itemId = "1234";
        const itemName = "ITEM_NAME";
        const dsId = "DS_ID";
        const displayName = `DS: ${dsId} - Name: ${itemName}`;
        const itemData = { randomData: 123 };

        const segments = await getContextDiffSegmentsProviderResult({
          DELEGATION: {
            "https://cdn-i-static-dns.rnd.cqloud.com/api/1/records?cdnId=74fc1710-7bee-4291-872d-82883cfaa016": {
              staticDnsResponseList: [
                {
                  cdnId: "74fc1710-7bee-4291-872d-82883cfaa016",
                  deliveryServiceId: dsId,
                  dnsRecordId: itemId,
                  name: itemName,
                  orgId: "devorg",
                  ttl: 1,
                  type: "TXT_RECORD",
                  value: "1",
                  ...itemData,
                },
              ],
            },
          },
        });
        const segmentChildren = segments[0].content.children as ContextDiffListEntity[];

        // List
        const list = segmentChildren.find((item) => item.name === listName) as ContextDiffListEntity;
        expect(list).toMatchObject({
          type: listType,
          name: listName,
          modifiedCount: 0,
          addedCount: 0,
          removedCount: 0,
          content: {
            kind: "known",
          },
        });
        const listChildren = list.content.children;

        // Items
        const item = listChildren.find((item) => item.name === displayName)!;
        expect(item).toMatchObject({
          type: listType,
          id: itemId,
          diff: {
            // Verify there is some data
            left: { ...itemData },
            right: { ...itemData },
          },
        });
        expect(item.diff.changesAmount).toEqual(0);
      });
    });
    describe("routing-and-monitoring", function () {
      it("segment details", async function () {
        const type = ContextDiffEntityTypeEnum.ROUTING_AND_MONITORING;

        const segments = await getContextDiffSegmentsProviderResult({
          "ROUTING-AND-MONITORING": {
            "https://cdn-i-cdns.rnd.cqloud.com/api/1/cdns/74fc1710-7bee-4291-872d-82883cfaa016/dns-routing-segments": {
              _links: {
                self: {
                  href:
                    "https://cdn-i-cdns.rnd.cqloud.com/api/1.0.0/cdns/74fc1710-7bee-4291-872d-82883cfaa016/dns-routing-segments",
                },
              },
              dnsRoutingSegments: [
                {
                  _links: {
                    self: {
                      href:
                        "https://cdn-i-cdns.rnd.cqloud.com/api/1.0.0/cdns/74fc1710-7bee-4291-872d-82883cfaa016/dns-routing-segments/dns_router_1",
                    },
                  },
                  cdnId: "74fc1710-7bee-4291-872d-82883cfaa016",
                  dnsRoutingSegmentId: "dns_router_1",
                  subDomain: "euw1",
                },
              ],
            },
          },
        });
        // Segment - Network
        expect(segments).toHaveLength(1);
        const segment = segments[0];
        expect(segment).toMatchObject({
          type: type,
          id: "ROUTING-AND-MONITORING",
          name: ListNameEnum.ROUTING_AND_MONITORING,
          changeCount: 0,
          content: {
            kind: "known",
          },
        });
      });
      it("dns routing segments", async function () {
        const listName = ListNameEnum.ROUTING_DNS_ROUTING_SEGMENTS;
        const listType = ContextDiffEntityTypeEnum.ROUTING_DNS_ROUTING_SEGMENTS;

        const itemId = "1234";
        const itemData = { randomData: 123 };

        const segments = await getContextDiffSegmentsProviderResult({
          "ROUTING-AND-MONITORING": {
            "https://cdn-i-cdns.rnd.cqloud.com/api/1/cdns/74fc1710-7bee-4291-872d-82883cfaa016/dns-routing-segments": {
              _links: {
                self: {
                  href:
                    "https://cdn-i-cdns.rnd.cqloud.com/api/1.0.0/cdns/74fc1710-7bee-4291-872d-82883cfaa016/dns-routing-segments",
                },
              },
              dnsRoutingSegments: [
                {
                  _links: {
                    self: {
                      href:
                        "https://cdn-i-cdns.rnd.cqloud.com/api/1.0.0/cdns/74fc1710-7bee-4291-872d-82883cfaa016/dns-routing-segments/dns_router_1",
                    },
                  },
                  cdnId: "74fc1710-7bee-4291-872d-82883cfaa016",
                  dnsRoutingSegmentId: itemId,
                  subDomain: "eu-1",
                  ...itemData,
                },
              ],
            },
          },
        });
        const segmentChildren = segments[0].content.children as ContextDiffListEntity[];

        // List
        const list = segmentChildren.find((item) => item.name === listName) as ContextDiffListEntity;
        expect(list).toMatchObject({
          type: listType,
          name: listName,
          modifiedCount: 0,
          addedCount: 0,
          removedCount: 0,
          content: {
            kind: "known",
          },
        });
        const listChildren = list.content.children;

        // Items
        const item = listChildren.find((item) => item.name === itemId)!;
        expect(item).toMatchObject({
          type: listType,
          id: itemId,
          diff: {
            // Verify there is some data
            left: { ...itemData },
            right: { ...itemData },
          },
        });
        expect(item.diff.changesAmount).toEqual(0);
      });
      it("router groups", async function () {
        const listName = ListNameEnum.ROUTING_ROUTER_GROUPS;
        const listType = ContextDiffEntityTypeEnum.ROUTING_ROUTER_GROUPS;

        const itemId = "1234";
        const itemName = "ITEM_NAME";
        const itemData = { randomData: 123 };

        const segments = await getContextDiffSegmentsProviderResult({
          "ROUTING-AND-MONITORING": {
            "https://cdn-i-cdns.rnd.cqloud.com/api/1/cdns/74fc1710-7bee-4291-872d-82883cfaa016/http-router-groups": {
              _links: {
                self: {
                  href:
                    "https://cdn-i-cdns.rnd.cqloud.com/api/1.0.0/cdns/74fc1710-7bee-4291-872d-82883cfaa016/http-router-groups",
                },
              },
              httpRouterGroups: [
                {
                  _links: {
                    self: {
                      href:
                        "https://cdn-i-cdns.rnd.cqloud.com/api/1.0.0/cdns/74fc1710-7bee-4291-872d-82883cfaa016/http-router-groups/5fb24720b1ecb000012dd22c",
                    },
                  },
                  cdnId: "74fc1710-7bee-4291-872d-82883cfaa016",
                  dnsName: "manifest-router-euw1",
                  fallbackGroups: ["5fb24757b1ecb000012dd22d"],
                  httpRouterGroupId: itemId,
                  httpRouterGroupName: itemName,
                  ttl: 30,
                  ...itemData,
                },
                {
                  _links: {
                    self: {
                      href:
                        "https://cdn-i-cdns.rnd.cqloud.com/api/1.0.0/cdns/74fc1710-7bee-4291-872d-82883cfaa016/http-router-groups/5fb24757b1ecb000012dd22d",
                    },
                  },
                  cdnId: "74fc1710-7bee-4291-872d-82883cfaa016",
                  dnsName: "manifest-router-euc1",
                  fallbackGroups: [],
                  httpRouterGroupId: "5fb24757b1ecb000012dd22d",
                  httpRouterGroupName: "manifest-router-euc1",
                  ttl: 30,
                },
              ],
            },
          },
        });
        const segmentChildren = segments[0].content.children as ContextDiffListEntity[];

        // List
        const list = segmentChildren.find((item) => item.name === listName) as ContextDiffListEntity;
        expect(list).toMatchObject({
          type: listType,
          name: listName,
          modifiedCount: 0,
          addedCount: 0,
          removedCount: 0,
          content: {
            kind: "known",
          },
        });
        const listChildren = list.content.children;

        // Items
        const item = listChildren.find((item) => item.name === itemName)!;
        expect(item).toMatchObject({
          type: listType,
          id: itemId,
          diff: {
            // Verify there is some data
            left: { ...itemData },
            right: { ...itemData },
          },
        });
        expect(item.diff.changesAmount).toEqual(0);
      });
      it("monitoring segments", async function () {
        const listName = ListNameEnum.ROUTING_MONITORING_SEGMENTS;
        const listType = ContextDiffEntityTypeEnum.ROUTING_MONITORING_SEGMENTS;

        const itemId = "1234";
        const itemData = { randomData: 123 };

        const segments = await getContextDiffSegmentsProviderResult({
          "ROUTING-AND-MONITORING": {
            "https://cdn-i-cdns.rnd.cqloud.com/api/1/cdns/74fc1710-7bee-4291-872d-82883cfaa016/monitoring-segments": {
              _links: {
                self: {
                  href:
                    "https://cdn-i-cdns.rnd.cqloud.com/api/1.0.0/cdns/74fc1710-7bee-4291-872d-82883cfaa016/monitoring-segments",
                },
              },
              monitoringSegments: [
                {
                  _links: {
                    self: {
                      href:
                        "https://cdn-i-cdns.rnd.cqloud.com/api/1.0.0/cdns/74fc1710-7bee-4291-872d-82883cfaa016/monitoring-segments/amiry-ms-1",
                    },
                  },
                  cdnId: "74fc1710-7bee-4291-872d-82883cfaa016",
                  fallbackSegments: [],
                  healthCollectorSystemIds: ["health-collector-cdn-i.opencaching.gcp-eu-3"],
                  monitoringSegmentId: itemId,
                  region: null,
                  ...itemData,
                },
              ],
            },
          },
        });
        const segmentChildren = segments[0].content.children as ContextDiffListEntity[];

        // List
        const list = segmentChildren.find((item) => item.name === listName) as ContextDiffListEntity;
        expect(list).toMatchObject({
          type: listType,
          name: listName,
          modifiedCount: 0,
          addedCount: 0,
          removedCount: 0,
          content: {
            kind: "known",
          },
        });
        const listChildren = list.content.children;

        // Items
        const item = listChildren.find((item) => item.name === itemId)!;
        expect(item).toMatchObject({
          type: listType,
          id: itemId,
          diff: {
            // Verify there is some data
            left: { ...itemData },
            right: { ...itemData },
          },
        });
        expect(item.diff.changesAmount).toEqual(0);
      });
      it("manifest-router assignments", async function () {
        const listName = ListNameEnum.ROUTING_MANIFEST_ROUTERS_ASSIGNMENTS;
        const listType = ContextDiffEntityTypeEnum.ROUTING_MANIFEST_ROUTERS_ASSIGNMENTS;

        const manifestRouterId1 = "manifestRouterId1";
        const manifestRouterId2 = "manifestRouterId2";

        const dsId1 = "dsId1";
        const dsName1 = "dsName1";
        const dsId2 = "dsId2";
        const dsName2 = "dsName2";

        const segments = await getContextDiffSegmentsProviderResult({
          ["DS/" + dsId1]: {
            ["https://cdn-i-delivery-services.rnd.cqloud.com/api/4/delivery-services/" + dsId1]: {
              apiVersion: "4.0.0",
              description: "",
              dsId: dsId1,
              dsRevisionDescriptions: [],
              isActive: true,
              name: dsName1,
              ownerOrgId: "devorg",
              userData: null,
            },
          },
          ["DS/" + dsId2]: {
            ["https://cdn-i-delivery-services.rnd.cqloud.com/api/4/delivery-services/" + dsId2]: {
              apiVersion: "4.0.0",
              description: "",
              dsId: dsId2,
              dsRevisionDescriptions: [],
              isActive: true,
              name: dsName2,
              ownerOrgId: "devorg",
              userData: null,
            },
          },
          "ROUTING-AND-MONITORING": {
            "https://cdn-i-ds-assignments.rnd.cqloud.com/api/3/ds-assignments/rules/manifest-router?cdnId=9e331b22-5d11-4067-9bf4-5f0992bd73fc": {
              manifestRouter: [
                {
                  assignmentBlocked: false,
                  cdnId: "1b9e60d2-c162-4b2c-8747-9fb988944b91",
                  deliveryService: {
                    id: dsId1,
                    label: "staging",
                  },
                  enabled: true,
                  manifestRouterId: manifestRouterId1,
                  ruleId: "ruleId1",
                },
                {
                  assignmentBlocked: false,
                  cdnId: "1b9e60d2-c162-4b2c-8747-9fb988944b91",
                  deliveryService: {
                    id: dsId2,
                    label: "staging",
                  },
                  enabled: true,
                  manifestRouterId: manifestRouterId1,
                  ruleId: "ruleId2",
                },
                {
                  assignmentBlocked: false,
                  cdnId: "1b9e60d2-c162-4b2c-8747-9fb988944b91",
                  deliveryService: {
                    id: dsId2,
                    label: "staging",
                  },
                  enabled: true,
                  manifestRouterId: manifestRouterId2,
                  ruleId: "ruleId3",
                },
              ],
            },
          },
        });
        const segment = segments.find((segment) => segment.type === ContextDiffEntityTypeEnum.ROUTING_AND_MONITORING)!;
        const segmentChildren = segment.content.children as ContextDiffListEntity[];

        // List
        const list = segmentChildren.find((item) => item.name === listName) as ContextDiffListEntity;
        expect(list).toMatchObject({
          type: listType,
          name: listName,
          modifiedCount: 0,
          addedCount: 0,
          removedCount: 0,
          content: {
            kind: "known",
          },
        });
        const listChildren = list.content.children;
        expect(listChildren).toHaveLength(3);
        expect(listChildren.every((item) => item.type === listType)).toBeTruthy();

        // Items
        expect(
          listChildren.find((item) => item.id.includes(manifestRouterId1) && item.id.includes(dsId1))
        ).toBeDefined();
        expect(
          listChildren.find((item) => item.id.includes(manifestRouterId1) && item.id.includes(dsId2))
        ).toBeDefined();
      });
      it("dns routers", async function () {
        const listName = ListNameEnum.ROUTING_DNS_ROUTERS;
        const listType = ContextDiffEntityTypeEnum.ROUTING_DNS_ROUTERS;

        const itemId = "1234";
        const itemData = { randomData: 123 };

        const segments = await getContextDiffSegmentsProviderResult({
          "ROUTING-AND-MONITORING": {
            "https://cdn-i-traffic-routers-monitors.rnd.cqloud.com/api/2.0/cdns/amiry-cdn/dns-routers": {
              dnsRouters: [
                {
                  dnsRoutingSegmentId: "dns_router_1",
                  domain: "oper.opencaching.tc-rnd.cqloud.com",
                  healthProviders: [
                    {
                      links: [],
                      name: "health-provider-cdn-i.opencaching.gcp-eu-3.dep.rnd.cqloud.com",
                      priority: 1,
                    },
                  ],
                  hostname: "dns-router-container-test-1",
                  ipv4Address: "34.89.230.10",
                  ipv6Address: null,
                  links: [],
                  status: "offline",
                  systemId: itemId,
                  type: "DNS Router",
                  ...itemData,
                },
                {
                  dnsRoutingSegmentId: "dns_router_1",
                  domain: "oper.opencaching.tc-rnd.cqloud.com",
                  healthProviders: [
                    {
                      links: [],
                      name: "health-provider-cdn-i.opencaching.gcp-eu-3.dep.rnd.cqloud.com",
                      priority: 1,
                    },
                  ],
                  hostname: "dns-router-cdn-i-opencaching-1",
                  ipv4Address: "35.198.103.120",
                  ipv6Address: null,
                  links: [],
                  status: "offline",
                  systemId: "DR-DevCdn-iOpencachingEu-w3",
                  type: "DNS Router",
                },
                {
                  dnsRoutingSegmentId: "dns_router_1",
                  domain: "oper.opencaching.tc-rnd.cqloud.com",
                  healthProviders: [
                    {
                      links: [],
                      name: "health-provider-cdn-i.opencaching.gcp-eu-3.dep.rnd.cqloud.com",
                      priority: 1,
                    },
                  ],
                  hostname: "dns-router-0-euw1-green",
                  ipv4Address: "52.214.12.20",
                  ipv6Address: null,
                  links: [],
                  status: "online",
                  systemId: "dns-router-0-euw1-green.opencaching.tc-rnd",
                  type: "DNS Router",
                },
              ],
            },
          },
        });
        const segmentChildren = segments[0].content.children as ContextDiffListEntity[];

        // List
        const list = segmentChildren.find((item) => item.name === listName) as ContextDiffListEntity;
        expect(list).toMatchObject({
          type: listType,
          name: listName,
          modifiedCount: 0,
          addedCount: 0,
          removedCount: 0,
          content: {
            kind: "known",
          },
        });
        const listChildren = list.content.children;

        // Items
        const item = listChildren.find((item) => item.name === itemId)!;
        expect(item).toMatchObject({
          type: listType,
          id: itemId,
          diff: {
            // Verify there is some data
            left: { ...itemData },
            right: { ...itemData },
          },
        });
        expect(item.diff.changesAmount).toEqual(0);
      });
      it("health collectors", async function () {
        const listName = ListNameEnum.ROUTING_HEALTH_COLLECTORS;
        const listType = ContextDiffEntityTypeEnum.ROUTING_HEALTH_COLLECTORS;

        const itemId = "1234";
        const itemData = { randomData: 123 };

        const segments = await getContextDiffSegmentsProviderResult({
          "ROUTING-AND-MONITORING": {
            "https://cdn-i-traffic-routers-monitors.rnd.cqloud.com/api/2.0/cdns/amiry-cdn/health-collectors": {
              healthCollectors: [
                {
                  domain: "gcp-eu-3.dep.rnd.cqloud.com",
                  healthCollectorRegion: "gcp-europe-west3",
                  hostname: "health-collector-cdn-i.opencaching",
                  links: [],
                  status: "online",
                  systemId: itemId,
                  type: "Health Collector",
                  ...itemData,
                },
                {
                  domain: "gcp-eu-3.dep.rnd.cqloud.com",
                  healthCollectorRegion: "gcp-europe-west3",
                  hostname: "health-collector-cdn-2.opencaching",
                  links: [],
                  status: "online",
                  systemId: "health-collector-cdn-2.opencaching.opencaching.gcp-eu-3",
                  type: "Health Collector",
                },
              ],
            },
          },
        });
        const segmentChildren = segments[0].content.children as ContextDiffListEntity[];

        // List
        const list = segmentChildren.find((item) => item.name === listName) as ContextDiffListEntity;
        expect(list).toMatchObject({
          type: listType,
          name: listName,
          modifiedCount: 0,
          addedCount: 0,
          removedCount: 0,
          content: {
            kind: "known",
          },
        });
        const listChildren = list.content.children;

        // Items
        const item = listChildren.find((item) => item.name === itemId)!;
        expect(item).toMatchObject({
          type: listType,
          id: itemId,
          diff: {
            // Verify there is some data
            left: { ...itemData },
            right: { ...itemData },
          },
        });
        expect(item.diff.changesAmount).toEqual(0);
      });
      it("http routers", async function () {
        const listName = ListNameEnum.ROUTING_HTTP_ROUTERS;
        const listType = ContextDiffEntityTypeEnum.ROUTING_HTTP_ROUTERS;

        const itemId = "1234";
        const itemData = { randomData: 123 };

        const segments = await getContextDiffSegmentsProviderResult({
          "ROUTING-AND-MONITORING": {
            "https://cdn-i-traffic-routers-monitors.rnd.cqloud.com/api/2.0/cdns/amiry-cdn/http-routers": {
              httpRouters: [
                {
                  domain: "oper.opencaching.tc-rnd.cqloud.com",
                  healthProviders: [
                    {
                      links: [],
                      name: "health-provider-cdn-i.opencaching.gcp-eu-3.dep.rnd.cqloud.com",
                      priority: 1,
                    },
                  ],
                  hostname: "manifest-router-0",
                  httpRouterGroupName: "manifest-router-euw1",
                  ipv4Address: "34.89.190.210",
                  ipv6Address: null,
                  links: [],
                  status: "offline",
                  systemId: itemId,
                  type: "Manifest Router",
                  ...itemData,
                },
                {
                  domain: "oper.opencaching.tc-rnd.cqloud.com",
                  healthProviders: [
                    {
                      links: [],
                      name: "health-provider-cdn-i.opencaching.gcp-eu-3.dep.rnd.cqloud.com",
                      priority: 1,
                    },
                  ],
                  hostname: "manifest-router-lb-0-euc1-green",
                  httpRouterGroupName: "manifest-router-euc1",
                  ipv4Address: "18.157.97.96",
                  ipv6Address: null,
                  links: [],
                  status: "online",
                  systemId: "manifest-router-lb-0-euc1-green.opencaching",
                  type: "Manifest Router",
                },
                {
                  domain: "oper.opencaching.tc-rnd.cqloud.com",
                  healthProviders: [
                    {
                      links: [],
                      name: "health-provider-cdn-i.opencaching.gcp-eu-3.dep.rnd.cqloud.com",
                      priority: 1,
                    },
                  ],
                  hostname: "manifest-router-lb-0-euw1-green",
                  httpRouterGroupName: "manifest-router-euw1",
                  ipv4Address: "34.241.175.34",
                  ipv6Address: null,
                  links: [],
                  status: "online",
                  systemId: "manifest-router-lb-0-euw1-green.opencaching",
                  type: "Manifest Router",
                },
              ],
            },
          },
        });
        const segmentChildren = segments[0].content.children as ContextDiffListEntity[];

        // List
        const list = segmentChildren.find((item) => item.name === listName) as ContextDiffListEntity;
        expect(list).toMatchObject({
          type: listType,
          name: listName,
          modifiedCount: 0,
          addedCount: 0,
          removedCount: 0,
          content: {
            kind: "known",
          },
        });
        const listChildren = list.content.children;

        // Items
        const item = listChildren.find((item) => item.name === itemId)!;
        expect(item).toMatchObject({
          type: listType,
          id: itemId,
          diff: {
            // Verify there is some data
            left: { ...itemData },
            right: { ...itemData },
          },
        });
        expect(item.diff.changesAmount).toEqual(0);
      });
    });
  });
  describe("should handle removals", function () {
    it("for segment level", async function () {
      const itemData = { randomData: 123 };
      const dsId = "5e3c30469877620001b1b25e";
      const cacheId = "31baa1ee-8525-4556-a450-3edfc885a85f";

      const segments = await getContextDiffSegmentsProviderResult(
        {
          "DS-ASSIGNMENTS/2757": {
            "https://cdn-i-ds-assignments.rnd.cqloud.com/api/3/ds-assignments/rules/delivery-unit?cdnId=cf6988d9-b341-412d-b978-99ccc407cf01&networkId=2757": {
              deliveryUnit: [
                {
                  assignmentBlocked: false,
                  cdnId: "cf6988d9-b341-412d-b978-99ccc407cf01",
                  deliveryService: {
                    id: `${dsId}`,
                    label: "stable",
                  },
                  deliveryUnitId: cacheId,
                  enabled: true,
                  networkId: 2757,
                  ruleId: "32baa1ee-8525-4556-a450-3edfc885a85f",
                  ...itemData,
                },
              ],
            },
          },
        },
        { dataRight: {} }
      );

      expect(segments).toHaveLength(1);
      const segment = segments[0];
      expect(segment).toMatchObject({
        changeCount: 1,
        content: {
          kind: "known",
        },
      });

      const segmentChildren = segments[0].content.children as ContextDiffListEntity[];
      expect(segmentChildren).toHaveLength(1);
      const list = segmentChildren[0];

      expect(list).toMatchObject({
        modifiedCount: 0,
        addedCount: 0,
        removedCount: 1,
        content: {
          kind: "known",
        },
      });

      const listChildren = list.content.children as ContextDiffItemEntity[];
      expect(listChildren).toHaveLength(1);
      const item = listChildren[0];

      expect(item.diff.left).toMatchObject(itemData);
      expect(item.diff.right).toEqual(undefined);
    });
    it("for item level", async function () {
      const itemData = { randomData: 123 };
      const dsId = "5e3c30469877620001b1b25e";
      const cacheId = "31baa1ee-8525-4556-a450-3edfc885a85f";

      const segments = await getContextDiffSegmentsProviderResult(
        {
          "DS-ASSIGNMENTS/2757": {
            "https://cdn-i-ds-assignments.rnd.cqloud.com/api/3/ds-assignments/rules/delivery-unit?cdnId=cf6988d9-b341-412d-b978-99ccc407cf01&networkId=2757": {
              deliveryUnit: [
                {
                  assignmentBlocked: false,
                  cdnId: "cf6988d9-b341-412d-b978-99ccc407cf01",
                  deliveryService: {
                    id: `${dsId}`,
                    label: "stable",
                  },
                  deliveryUnitId: cacheId,
                  enabled: true,
                  networkId: 2757,
                  ruleId: "32baa1ee-8525-4556-a450-3edfc885a85f",
                  ...itemData,
                },
              ],
            },
          },
        },
        {
          dataRight: {
            "DS-ASSIGNMENTS/2757": {
              "https://cdn-i-ds-assignments.rnd.cqloud.com/api/3/ds-assignments/rules/delivery-unit?cdnId=cf6988d9-b341-412d-b978-99ccc407cf01&networkId=2757": {
                deliveryUnit: [],
              },
            },
          },
        }
      );

      expect(segments).toHaveLength(1);
      const segment = segments[0];
      expect(segment).toMatchObject({
        changeCount: 1,
        content: {
          kind: "known",
        },
      });

      const segmentChildren = segments[0].content.children as ContextDiffListEntity[];
      expect(segmentChildren).toHaveLength(1);
      const list = segmentChildren[0];

      expect(list).toMatchObject({
        modifiedCount: 0,
        addedCount: 0,
        removedCount: 1,
        content: {
          kind: "known",
        },
      });

      const listChildren = list.content.children as ContextDiffItemEntity[];
      expect(listChildren).toHaveLength(1);
      const item = listChildren[0];

      expect(item.diff.left).toMatchObject(itemData);
      expect(item.diff.right).toEqual(undefined);
    });
  });
  describe("should handle additions", function () {
    it("for segment level", async function () {
      const itemData = { randomData: 123 };
      const dsId = "5e3c30469877620001b1b25e";
      const cacheId = "31baa1ee-8525-4556-a450-3edfc885a85f";

      const segments = await getContextDiffSegmentsProviderResult(
        {},
        {
          dataRight: {
            "DS-ASSIGNMENTS/2757": {
              "https://cdn-i-ds-assignments.rnd.cqloud.com/api/3/ds-assignments/rules/delivery-unit?cdnId=cf6988d9-b341-412d-b978-99ccc407cf01&networkId=2757": {
                deliveryUnit: [
                  {
                    assignmentBlocked: false,
                    cdnId: "cf6988d9-b341-412d-b978-99ccc407cf01",
                    deliveryService: {
                      id: `${dsId}`,
                      label: "stable",
                    },
                    deliveryUnitId: cacheId,
                    enabled: true,
                    networkId: 2757,
                    ruleId: "32baa1ee-8525-4556-a450-3edfc885a85f",
                    ...itemData,
                  },
                ],
              },
            },
          },
        }
      );

      expect(segments).toHaveLength(1);
      const segment = segments[0];
      expect(segment).toMatchObject({
        changeCount: 1,
        content: {
          kind: "known",
        },
      });

      const segmentChildren = segments[0].content.children as ContextDiffListEntity[];
      expect(segmentChildren).toHaveLength(1);
      const list = segmentChildren[0];

      expect(list).toMatchObject({
        modifiedCount: 0,
        addedCount: 1,
        removedCount: 0,
        content: {
          kind: "known",
        },
      });

      const listChildren = list.content.children as ContextDiffItemEntity[];
      expect(listChildren).toHaveLength(1);
      const item = listChildren[0];

      expect(item.diff.left).toEqual(undefined);
      expect(item.diff.right).toMatchObject(itemData);
    });
    it("for item level", async function () {
      const itemData = { randomData: 123 };
      const dsId = "5e3c30469877620001b1b25e";
      const cacheId = "31baa1ee-8525-4556-a450-3edfc885a85f";

      const segments = await getContextDiffSegmentsProviderResult(
        {
          "DS-ASSIGNMENTS/2757": {
            "https://cdn-i-ds-assignments.rnd.cqloud.com/api/3/ds-assignments/rules/delivery-unit?cdnId=cf6988d9-b341-412d-b978-99ccc407cf01&networkId=2757": {
              deliveryUnit: [],
            },
          },
        },
        {
          dataRight: {
            "DS-ASSIGNMENTS/2757": {
              "https://cdn-i-ds-assignments.rnd.cqloud.com/api/3/ds-assignments/rules/delivery-unit?cdnId=cf6988d9-b341-412d-b978-99ccc407cf01&networkId=2757": {
                deliveryUnit: [
                  {
                    assignmentBlocked: false,
                    cdnId: "cf6988d9-b341-412d-b978-99ccc407cf01",
                    deliveryService: {
                      id: `${dsId}`,
                      label: "stable",
                    },
                    deliveryUnitId: cacheId,
                    enabled: true,
                    networkId: 2757,
                    ruleId: "32baa1ee-8525-4556-a450-3edfc885a85f",
                    ...itemData,
                  },
                ],
              },
            },
          },
        }
      );

      expect(segments).toHaveLength(1);
      const segment = segments[0];
      expect(segment).toMatchObject({
        changeCount: 1,
        content: {
          kind: "known",
        },
      });

      const segmentChildren = segments[0].content.children as ContextDiffListEntity[];
      expect(segmentChildren).toHaveLength(1);
      const list = segmentChildren[0];

      expect(list).toMatchObject({
        modifiedCount: 0,
        addedCount: 1,
        removedCount: 0,
        content: {
          kind: "known",
        },
      });

      const listChildren = list.content.children as ContextDiffItemEntity[];
      expect(listChildren).toHaveLength(1);
      const item = listChildren[0];

      expect(item.diff.left).toEqual(undefined);
      expect(item.diff.right).toMatchObject(itemData);
    });
  });
  describe("should handle modifications", function () {
    it("between 2 items", async function () {
      const itemDataLeft = { randomDataLeft: 123 };
      const itemDataRight = { randomDataRight: 345 };
      const dsId = "5e3c30469877620001b1b25e";
      const cacheId = "31baa1ee-8525-4556-a450-3edfc885a85f";

      const segments = await getContextDiffSegmentsProviderResult(
        {
          "DS-ASSIGNMENTS/2757": {
            "https://cdn-i-ds-assignments.rnd.cqloud.com/api/3/ds-assignments/rules/delivery-unit?cdnId=cf6988d9-b341-412d-b978-99ccc407cf01&networkId=2757": {
              deliveryUnit: [
                {
                  assignmentBlocked: false,
                  cdnId: "cf6988d9-b341-412d-b978-99ccc407cf01",
                  deliveryService: {
                    id: `${dsId}`,
                    label: "stable",
                  },
                  deliveryUnitId: cacheId,
                  enabled: true,
                  networkId: 2757,
                  ruleId: "32baa1ee-8525-4556-a450-3edfc885a85f",
                  ...itemDataLeft,
                },
              ],
            },
          },
        },
        {
          dataRight: {
            "DS-ASSIGNMENTS/2757": {
              "https://cdn-i-ds-assignments.rnd.cqloud.com/api/3/ds-assignments/rules/delivery-unit?cdnId=cf6988d9-b341-412d-b978-99ccc407cf01&networkId=2757": {
                deliveryUnit: [
                  {
                    assignmentBlocked: false,
                    cdnId: "cf6988d9-b341-412d-b978-99ccc407cf01",
                    deliveryService: {
                      id: `${dsId}`,
                      label: "stable",
                    },
                    deliveryUnitId: cacheId,
                    enabled: true,
                    networkId: 2757,
                    ruleId: "32baa1ee-8525-4556-a450-3edfc885a85f",
                    ...itemDataRight,
                  },
                ],
              },
            },
          },
        }
      );

      expect(segments).toHaveLength(1);
      const segment = segments[0];
      expect(segment).toMatchObject({
        changeCount: 1,
        content: {
          kind: "known",
        },
      });

      const segmentChildren = segments[0].content.children as ContextDiffListEntity[];
      expect(segmentChildren).toHaveLength(1);
      const list = segmentChildren[0];

      expect(list).toMatchObject({
        modifiedCount: 1,
        addedCount: 0,
        removedCount: 0,
        content: {
          kind: "known",
        },
      });

      const listChildren = list.content.children as ContextDiffItemEntity[];
      expect(listChildren).toHaveLength(1);
      const item = listChildren[0];

      expect(item.diff.changesAmount).toBeGreaterThan(0);
      expect(item.diff.left).toMatchObject(itemDataLeft);
      expect(item.diff.right).toMatchObject(itemDataRight);
    });

    it("between with deletions, additions and modifications", async function () {
      const dsId = "5e3c30469877620001b1b25e";

      const segments = await getContextDiffSegmentsProviderResult(
        {
          "DS-ASSIGNMENTS/2757": {
            "https://cdn-i-ds-assignments.rnd.cqloud.com/api/3/ds-assignments/rules/network?cdnId=cf6988d9-b341-412d-b978-99ccc407cf01&networkId=2749": {
              network: [
                {
                  cdnId: "cf6988d9-b341-412d-b978-99ccc407cf01",
                  deliveryService: {
                    id: "5e4e592e2e016f0001046c31",
                    label: "poc",
                  },
                  enabled: true,
                  networkId: 2749,
                  ruleId: "6e56f65b-b9b3-428f-9ac1-1f6bc2625f02",
                },
                {
                  cdnId: "cf6988d9-b341-412d-b978-99ccc407cf01",
                  deliveryService: {
                    id: `${dsId}`,
                    label: "stable",
                  },
                  enabled: true,
                  networkId: 2749,
                  ruleId: "ecf010cc-b01d-48bd-8506-c397322ee026",
                },
              ],
            },
          },
        },
        {
          dataRight: {
            "DS-ASSIGNMENTS/2757": {
              "https://cdn-i-ds-assignments.rnd.cqloud.com/api/3/ds-assignments/rules/network?cdnId=cf6988d9-b341-412d-b978-99ccc407cf01&networkId=2749": {
                network: [
                  // NEW ITEM
                  {
                    cdnId: "cf6988d9-b341-412d-b978-99ccc407cf01",
                    deliveryService: {
                      id: "5e4bb34f11f31c00014b6a02",
                      label: "stable",
                    },
                    enabled: true,
                    networkId: 2749,
                    ruleId: "41c4417d-5d6c-4665-93ed-6cd99ec3e7d6",
                  },
                  // MODIFIED ITEM
                  {
                    cdnId: "cf6988d9-b341-412d-b978-99ccc407cf01",
                    deliveryService: {
                      id: "5e4e592e2e016f0001046c31",
                      label: "CHANGED VALUE",
                    },
                    enabled: true,
                    networkId: 2749,
                    ruleId: "6e56f65b-b9b3-428f-9ac1-1f6bc2625f02",
                  },
                ],
              },
            },
          },
        }
      );

      expect(segments).toHaveLength(1);
      const segment = segments[0];
      expect(segment).toMatchObject({
        changeCount: 3,
        content: {
          kind: "known",
        },
      });

      const segmentChildren = segments[0].content.children as ContextDiffListEntity[];
      expect(segmentChildren).toHaveLength(1);
      const list = segmentChildren[0];

      expect(list).toMatchObject({
        modifiedCount: 1,
        addedCount: 1,
        removedCount: 1,
        content: {
          kind: "known",
        },
      });
    });
  });
  describe("should handle unknown items", function () {
    it("on segment level", async function () {
      const knownSegmentId = "NETWORK/2749";
      const unknonwSegmentId = "BLA/TEMP";
      const unknownSegmentData = {
        listOfStuff: [{ id: 1, name: "item" }],
        otherListOfStuff: [{ id: 1, name: "item" }],
      };

      const segments = await getContextDiffSegmentsProviderResult({
        "NETWORK/2749": {
          "https://cdn-i-qn-deployment.rnd.cqloud.com/api/2/entities?contained_in_list_format=none&contains_list_format=none&entities_list_format=details&ids=2749&types=network": {
            entities: [
              {
                attributes: {},
                id: 2749,
                name: "Charter",
                type: "network",
                uniqueName: "rgnAmerica_cnUsa_nwkCharter",
              },
            ],
          },
        },
        [unknonwSegmentId]: {
          ...unknownSegmentData,
        },
      });

      expect(segments).toHaveLength(2);
      expect(segments.find((segment) => segment.id === knownSegmentId)).toMatchObject({
        type: ContextDiffEntityTypeEnum.NETWORK,
        content: {
          kind: "known",
        },
      });

      const unknownSegment = segments.find((segment) => segment.id === unknonwSegmentId);
      expect(unknownSegment).toMatchObject({
        type: ContextDiffEntityTypeEnum.UNKNOWN,
        id: unknonwSegmentId,
        name: unknonwSegmentId,
        changeCount: 0,
        content: {
          kind: "unknown",
        },
      });

      const segmentChildren = unknownSegment!.content.children as ContextDiffItemEntity[];
      // Since data is unknown, we expect it all bundled in a single object
      expect(segmentChildren).toHaveLength(1);
      const item = segmentChildren[0];
      expect(item).toMatchObject({
        type: ContextDiffEntityTypeEnum.UNKNOWN,
        id: unknonwSegmentId,
        name: unknonwSegmentId,
        diff: {
          // Verify there is some data
          left: {
            ...unknownSegmentData,
          },
          right: {
            ...unknownSegmentData,
          },
        },
      });
    });
    it("on list level", async function () {
      const unknownListId = "unknownList";
      const knownListId =
        "https://cdn-i-qn-deployment.rnd.cqloud.com/api/2/entities?contained_in_list_format=none&contains_list_format=none&entities_list_format=details&ids=2749&types=network";

      const segments = await getContextDiffSegmentsProviderResult({
        "NETWORK/2749": {
          [unknownListId]: {
            listOfStuff: [{ id: 1, name: "item" }],
          },
          [knownListId]: {
            entities: [
              {
                attributes: {},
                id: 2749,
                name: "Charter",
                type: "network",
                uniqueName: "rgnAmerica_cnUsa_nwkCharter",
              },
            ],
          },
        },
      });

      expect(segments).toHaveLength(1);
      const segment = segments[0];
      expect(segment).toMatchObject({
        type: ContextDiffEntityTypeEnum.NETWORK,
        content: {
          kind: "known",
        },
      });

      const segmentChildren = segments[0].content.children as ContextDiffListEntity[];
      // Since data is unknown, we expect it all bundled in a single object
      expect(segmentChildren).toHaveLength(2);
      const knownList = segmentChildren.find((list) => list.id === knownListId);
      expect(knownList).toMatchObject({
        type: ContextDiffEntityTypeEnum.NETWORK,
        content: {
          kind: "known",
        },
      });

      const unknownList = segmentChildren.find((list) => list.id === unknownListId);
      expect(unknownList).toMatchObject({
        type: ContextDiffEntityTypeEnum.UNKNOWN,
        modifiedCount: 0,
        addedCount: 0,
        removedCount: 0,

        content: {
          kind: "unknown",
        },
      });
    });

    it("if they are modified", async function () {
      const unknownListId = "unknownList";
      const segments = await getContextDiffSegmentsProviderResult(
        {
          "NETWORK/2749": {
            [unknownListId]: {
              listOfStuff: [{ id: 1, name: "item" }],
            },
          },
        },
        {
          dataRight: {
            "NETWORK/2749": {
              [unknownListId]: {
                listOfStuff: [{ id: 2, name: "item" }],
              },
            },
          },
        }
      );

      expect(segments).toHaveLength(1);
      expect(segments[0]).toMatchObject({
        changeCount: 1,
        content: {
          kind: "known",
        },
      });

      const segmentChildren = segments[0].content.children as ContextDiffListEntity[];
      // Since data is unknown, we expect it all bundled in a single object
      expect(segmentChildren).toHaveLength(1);

      const unknownList = segmentChildren[0];
      expect(unknownList).toMatchObject({
        type: ContextDiffEntityTypeEnum.UNKNOWN,
        modifiedCount: 1,
        addedCount: 0,
        removedCount: 0,
        content: {
          kind: "unknown",
        },
      });
    });
  });
});
