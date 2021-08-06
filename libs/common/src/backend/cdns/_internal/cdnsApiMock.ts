/* eslint-disable unused-imports/no-unused-vars,unused-imports/no-unused-vars */
import { AjaxMetadata } from "../../../utils/ajax";
import { mockNetworkSleep } from "../../../utils/mockUtils";
import { sleep } from "../../../utils/sleep";
import { CdnsApi } from "../../cdns";
import { loggerCreator } from "../../../utils/logger";
import { CdnApiResult, CdnEditApiType } from "../_types/cdnApiType";
import {
  DeliveryUnitGroupApiResult,
  DeliveryUnitGroupEditApiType,
  DispersionCalculationMethodsEnum,
} from "../_types/deliveryUnitGroupApiType";
import {
  CacheOperationalModeApiEnum,
  DeliveryUnitApiResult,
  DeliveryUnitEditApiType,
  DeliveryUnitHealthProfileApiType,
} from "../_types/deliveryUnitApiType";
import { CdnLocationApiResult, CdnLocationEditApiType } from "../_types/cdnLocationApiType";
import { HttpRouterGroupsApiResult, HttpRouterGroupType } from "../_types/httpRouterGroupType";
import mockData from "../../_utils/mockData";

const moduleLogger = loggerCreator("__filename");

const defaultHealthProfile: DeliveryUnitHealthProfileApiType = {
  healthMinAvailableBwKbpsEnabled: false,
  healthMinAvailableBwKbps: 0,
  healthMaxLoadAverage: 25,
  healthMaxQueryTimeMs: 2000,
  healthConnectionTimeoutMs: 2000,
  healthHistoryCount: 30,
  healthPollUrlTemplate: null,
  healthSampleTimeMs: 1000,
  healthReportTimeMs: 200,
  healthRequestTimeoutMs: 400,
  healthRequestTimeWarnMs: 100,
};

export class CdnsApiMock implements CdnsApi {
  // CDNS
  ////////

  async cdnList(metadata: AjaxMetadata): Promise<CdnApiResult> {
    await sleep(mockNetworkSleep);
    return {
      cdns: [
        {
          cdnId: "1b9e60d2-c162-4b2c-8747-9fb988944b91",
          name: "qwilted-test",
          description: "New Ark Test CDN",
          httpRootHostedZone: "qwilted-test.cqloud.com",
          httpCdnSubDomain: "",
          httpSubDomain: "",
          dnsRootHostedZone: "qwilted-test.cqloud.com",
          dnsCdnSubDomain: "",
          dnsSubDomain: "",
          operationalDomain: "qwilted-test-oper.cqloud.com",
        },
        {
          cdnId: "7efac63b-f825-48da-a785-7540eda51985",
          name: "amiry-cdn-2",
          description: "",
          httpRootHostedZone: "amiry-cdn.cqloud.com",
          httpCdnSubDomain: "",
          httpSubDomain: "",
          dnsRootHostedZone: "amiry-cdn.cqloud.com",
          dnsCdnSubDomain: "",
          dnsSubDomain: "",
          ctrSubDomain: null,
        },
        {
          cdnId: "9b2d89fe-7078-41e1-89c9-077f041ba480",
          name: "Yuval-cdn",
          description: "DS-network tester",
          httpRootHostedZone: "amiry-test",
          httpCdnSubDomain: "test",
          httpSubDomain: "test",
          dnsRootHostedZone: "test",
          dnsCdnSubDomain: "",
          dnsSubDomain: "",
          ctrSubDomain: null,
        },
        {
          cdnId: "9e331b22-5d11-4067-9bf4-5f0992bd73fc",
          name: "opencaching",
          description: "",
          httpRootHostedZone: "opencaching.tc-rnd.cqloud.com",
          httpCdnSubDomain: "cdn-i",
          httpSubDomain: "http",
          dnsRootHostedZone: "opencaching.tc-rnd.cqloud.com",
          dnsCdnSubDomain: "cdn-i",
          dnsSubDomain: "dns",
          ctrSubDomain: null,
        },
        {
          cdnId: "cf6988d9-b341-412d-b978-99ccc407cf01",
          name: "amiry-cdn",
          description: "",
          httpRootHostedZone: "amiry-cdn.cqloud.com",
          httpCdnSubDomain: "",
          httpSubDomain: "",
          dnsRootHostedZone: "amiry-cdn.cqloud.com",
          dnsCdnSubDomain: "",
          dnsSubDomain: "",
          ctrSubDomain: null,
        },
      ],
      _links: { self: { href: "http://cdn-i-cdns.rnd.cqloud.com/api/1.0.0/cdns" } },
    };
  }

  async cdnCreate(values: CdnEditApiType): Promise<void> {
    await sleep(mockNetworkSleep);
  }

  async cdnUpdate(id: string, values: CdnEditApiType): Promise<void> {
    await sleep(mockNetworkSleep);
  }

  async cdnDelete(id: string): Promise<void> {
    await sleep(mockNetworkSleep);
  }

  // Delivery unit groups
  /////////////////////////

  async deliveryUnitGroupsList(cdnId: string, metadata?: AjaxMetadata): Promise<DeliveryUnitGroupApiResult> {
    return {
      duGroups: [
        {
          duGroupId: "05d51a22-abae-43cc-87fa-692a55eb8f0b",
          cdnId: "9b2d89fe-7078-41e1-89c9-077f041ba480",
          name: "Yuval-group",
          type: "mid",
          longitude: 0.0,
          latitude: 0.0,
          networkId: 100,
          parentDeliveryUnitGroupId: null,
          fallbackDeliveryUnitGroups: [
            "84eea49e-1d13-4030-9f99-6e4eb08add46",
            "0ab58692-b0af-44a7-b3a5-d33319c20ed1",
            "e49a00a5-2821-4d10-bbf8-cec2fd85a803",
          ],
          dispersion: 5,
          dispersionCalculationMethod: DispersionCalculationMethodsEnum.SET,
        },
        {
          duGroupId: "0ab58692-b0af-44a7-b3a5-d33319c20ed1",
          cdnId: "9b2d89fe-7078-41e1-89c9-077f041ba480",
          name: "Cg-edge-10075-rome-interload",
          type: "edge",
          networkId: 100,
          longitude: 0.0,
          latitude: 0.0,
          parentDeliveryUnitGroupId: "05d51a22-abae-43cc-87fa-692a55eb8f0b",
          fallbackDeliveryUnitGroups: [],
          dispersion: 3,
          dispersionCalculationMethod: DispersionCalculationMethodsEnum.FACTOR,
        },
        {
          duGroupId: "26d99d18-4257-4862-8b4a-85b784d13d7b",
          cdnId: "9b2d89fe-7078-41e1-89c9-077f041ba480",
          name: "Yuval-group-3",
          type: "mid",
          networkId: 100,
          longitude: 0.0,
          latitude: 0.0,
          parentDeliveryUnitGroupId: null,
          fallbackDeliveryUnitGroups: [],
          dispersion: 1,
          dispersionCalculationMethod: DispersionCalculationMethodsEnum.FACTOR,
        },
        {
          duGroupId: "84eea49e-1d13-4030-9f99-6e4eb08add46",
          cdnId: "9b2d89fe-7078-41e1-89c9-077f041ba480",
          name: "Cg-edge-10086-rome-interloaddddddd",
          type: "edge",
          networkId: 100,
          longitude: 3.0,
          latitude: 0.0,
          parentDeliveryUnitGroupId: null,
          fallbackDeliveryUnitGroups: [
            "05d51a22-abae-43cc-87fa-692a55eb8f0b",
            "0ab58692-b0af-44a7-b3a5-d33319c20ed1",
            "e49a00a5-2821-4d10-bbf8-cec2fd85a803",
          ],
          dispersion: 1,
          dispersionCalculationMethod: DispersionCalculationMethodsEnum.FACTOR,
        },
        {
          duGroupId: "e49a00a5-2821-4d10-bbf8-cec2fd85a803",
          cdnId: "9b2d89fe-7078-41e1-89c9-077f041ba480",
          name: "Cg-edge-10435-rome-interload",
          type: "edge",
          networkId: 100,
          longitude: 0.0,
          latitude: 0.0,
          parentDeliveryUnitGroupId: null,
          fallbackDeliveryUnitGroups: [
            "05d51a22-abae-43cc-87fa-692a55eb8f0b",
            "0ab58692-b0af-44a7-b3a5-d33319c20ed1",
            "26d99d18-4257-4862-8b4a-85b784d13d7b",
          ],
          dispersion: 1,
          dispersionCalculationMethod: DispersionCalculationMethodsEnum.FACTOR,
        },
      ],
    };
  }

  async deliveryUnitGroupsCreate(cdnId: string, values: DeliveryUnitGroupEditApiType): Promise<void> {
    await sleep(mockNetworkSleep);
  }

  async deliveryUnitGroupsUpdate(cdnId: string, id: string, values: DeliveryUnitGroupEditApiType): Promise<void> {
    await sleep(mockNetworkSleep);
  }

  async deliveryUnitGroupsDelete(cdnId: string, id: string): Promise<void> {
    await sleep(mockNetworkSleep);
  }

  // Delivery units
  /////////////////

  async deliveryUnitsList(cdnId: string): Promise<DeliveryUnitApiResult> {
    return {
      deliveryUnits: [
        {
          deliveryUnitId: mockData.deliveryUnitIds[0],
          cdnId: "9b2d89fe-7078-41e1-89c9-077f041ba480",
          name: "3T0DF5J-du",
          systemId: "3T0DF5J",
          duGroupId: "84eea49e-1d13-4030-9f99-6e4eb08add46",
          networkId: 100,
          cacheHashId: "",
          operationalMode: CacheOperationalModeApiEnum.OFFLINE,
          monitoringSegmentId: "tester",
          numericId: 2,
          deliveryUnitInterfaces: {},
          ...defaultHealthProfile,
        },
        {
          deliveryUnitId: mockData.deliveryUnitIds[1],
          cdnId: "9b2d89fe-7078-41e1-89c9-077f041ba480",
          name: "59CWH42-du",
          systemId: "59CWH42",
          duGroupId: "e49a00a5-2821-4d10-bbf8-cec2fd85a803",
          cacheHashId: "",
          networkId: 100,
          operationalMode: CacheOperationalModeApiEnum.OFFLINE,
          monitoringSegmentId: "tester",
          numericId: 1,
          deliveryUnitInterfaces: {},
          ...defaultHealthProfile,
        },
        {
          deliveryUnitId: mockData.deliveryUnitIds[2],
          cdnId: "9b2d89fe-7078-41e1-89c9-077f041ba480",
          name: "testQn008-du",
          systemId: "testQn008",
          duGroupId: "84eea49e-1d13-4030-9f99-6e4eb08add46",
          cacheHashId: "",
          networkId: 100,
          operationalMode: CacheOperationalModeApiEnum.ONLINE,
          monitoringSegmentId: "tester",
          numericId: 24,
          deliveryUnitInterfaces: {},
          ...defaultHealthProfile,
        },
        {
          deliveryUnitId: mockData.deliveryUnitIds[3],
          cdnId: "9b2d89fe-7078-41e1-89c9-077f041ba480",
          name: "4683ZX1-du",
          systemId: "4683ZX1",
          duGroupId: "84eea49e-1d13-4030-9f99-6e4eb08add46",
          cacheHashId: "",
          networkId: 100,
          operationalMode: CacheOperationalModeApiEnum.OFFLINE,
          monitoringSegmentId: "tester",
          numericId: 3,
          deliveryUnitInterfaces: {},
          ...defaultHealthProfile,
        },
        {
          deliveryUnitId: mockData.deliveryUnitIds[4],
          cdnId: "9b2d89fe-7078-41e1-89c9-077f041ba480",
          name: "53GXG62-du",
          systemId: "53GXG62",
          duGroupId: "e49a00a5-2821-4d10-bbf8-cec2fd85a803",
          cacheHashId: "",
          networkId: 100,
          operationalMode: CacheOperationalModeApiEnum.OFFLINE,
          monitoringSegmentId: "tester",
          numericId: 4,
          deliveryUnitInterfaces: {},
          ...defaultHealthProfile,
        },
      ],
    };
  }

  async deliveryUnitsCreate(cdnId: string, values: DeliveryUnitEditApiType): Promise<void> {
    await sleep(mockNetworkSleep);
  }

  async deliveryUnitsUpdate(cdnId: string, id: string, values: DeliveryUnitEditApiType): Promise<void> {
    await sleep(mockNetworkSleep);
  }

  async deliveryUnitsDelete(cdnId: string, id: string): Promise<void> {
    await sleep(mockNetworkSleep);
  }

  // Locations

  async locationList(cdnId: string): Promise<CdnLocationApiResult> {
    await sleep(mockNetworkSleep);
    return {
      locations: [
        {
          locationId: "a40fcebd-b467-4f4f-b5d8-38f7d741f5fb",
          cdnId: "9b2d89fe-7078-41e1-89c9-077f041ba480",
          name: "Entire CDN",
          description: "Automatically generated location representing the entire CDN",
          entireCdn: true,
          _links: {
            self: {
              href:
                "http://cdn-i-cdns.rnd.cqloud.com/api/1.0.0/cdns/9b2d89fe-7078-41e1-89c9-077f041ba480/locations/a40fcebd-b467-4f4f-b5d8-38f7d741f5fb",
            },
          },
        },
        {
          locationId: "cf8ff514-1aa0-4e11-9fac-52a443a28442",
          cdnId: "9b2d89fe-7078-41e1-89c9-077f041ba480",
          name: "Test-Location",
          description: null,
          entireCdn: false,
          _links: {
            self: {
              href:
                "http://cdn-i-cdns.rnd.cqloud.com/api/1.0.0/cdns/9b2d89fe-7078-41e1-89c9-077f041ba480/locations/cf8ff514-1aa0-4e11-9fac-52a443a28442",
            },
          },
        },
      ],
      _links: {
        self: {
          href: "http://cdn-i-cdns.rnd.cqloud.com/api/1.0.0/cdns/9b2d89fe-7078-41e1-89c9-077f041ba480/locations",
        },
      },
    };
  }

  async locationUpdate(cdnId: string, id: string, values: CdnLocationEditApiType): Promise<void> {
    await sleep(mockNetworkSleep);
  }

  async locationCreate(cdnId: string, values: { name: string }): Promise<void> {
    await sleep(mockNetworkSleep);
  }

  async locationDelete(cdnId: string, id: string): Promise<void> {
    await sleep(mockNetworkSleep);
  }

  // HTTP Router groups
  /////////////////////////

  async httpRouterGroupsList(cdnId: string, metadata?: AjaxMetadata): Promise<HttpRouterGroupsApiResult> {
    await sleep(mockNetworkSleep);
    return {
      httpRouterGroups: [
        {
          httpRouterGroupId: "5e89d7d779f43f00013bac7b",
          httpRouterGroupName: "Europe-Group-2",
          dnsName: "dnsName1",
          fallbackGroups: ["5e8b3bf6997b0b0001f7cc8b"],
          ttl: 60,
          cdnId: "9b2d89fe-7078-41e1-89c9-077f041ba480",
          _links: {
            self: {
              href:
                "http://cdn-i-cdns.rnd.cqloud.com/api/1.0.0/cdns/9b2d89fe-7078-41e1-89c9-077f041ba480/http-router-groups/5e89d7d779f43f00013bac7b",
            },
          },
        },
        {
          httpRouterGroupId: "5e8b3bf6997b0b0001f7cc8b",
          httpRouterGroupName: "Europe-Group",
          dnsName: "123",
          fallbackGroups: ["5e89d7d779f43f00013bac7b"],
          ttl: 0,
          cdnId: "9b2d89fe-7078-41e1-89c9-077f041ba480",
          _links: {
            self: {
              href:
                "http://cdn-i-cdns.rnd.cqloud.com/api/1.0.0/cdns/9b2d89fe-7078-41e1-89c9-077f041ba480/http-router-groups/5e8b3bf6997b0b0001f7cc8b",
            },
          },
        },
        {
          httpRouterGroupId: "5e96193e6d2c9b0001d20eec",
          httpRouterGroupName: "USA-Group",
          dnsName: "Qwilt",
          fallbackGroups: ["5e8b3bf6997b0b0001f7cc8b", "5e89d7d779f43f00013bac7b"],
          ttl: 0,
          cdnId: "9b2d89fe-7078-41e1-89c9-077f041ba480",
          _links: {
            self: {
              href:
                "http://cdn-i-cdns.rnd.cqloud.com/api/1.0.0/cdns/9b2d89fe-7078-41e1-89c9-077f041ba480/http-router-groups/5e96193e6d2c9b0001d20eec",
            },
          },
        },
      ],
      _links: {
        self: {
          href:
            "http://cdn-i-cdns.rnd.cqloud.com/api/1.0.0/cdns/9b2d89fe-7078-41e1-89c9-077f041ba480/http-router-groups",
        },
      },
    };
  }

  async httpRouterGroupsCreate(cdnId: string, values: HttpRouterGroupType) {
    await sleep(mockNetworkSleep);
  }

  async httpRouterGroupsUpdate(cdnId: string, id: string, values: HttpRouterGroupType) {
    await sleep(mockNetworkSleep);
  }

  async httpRouterGroupsDelete(cdnId: string, id: string) {
    await sleep(mockNetworkSleep);
  }

  //region [[ Singleton ]]
  protected static _instance: CdnsApiMock | undefined;
  static get instance(): CdnsApiMock {
    if (!this._instance) {
      this._instance = new CdnsApiMock();
    }

    return this._instance;
  }
  //endregion
}
