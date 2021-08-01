/// <reference types="cypress" />

import "../support/index";

const CDN_ID = "9b2d89fe-7078-41e1-89c9-077f041ba480";
const LOCATION_ID = "a40fcebd-b467-4f4f-b5d8-38f7d741f5fb";
const DUG_ID = "05d51a22-abae-43cc-87fa-692a55eb8f0b";
const DU_ID = "15b10213-0c8f-422e-baa0-d43a3ad77cdb";
const NETWORK_ID = 2816;
const TAB = "caches";

const CDNS_URL = "https://cdns.cqloud.com/api/1.0/cdns/";

context("Caches tab", () => {
  beforeEach(() => {
    cy.viewport(1300, 660);
    cy.visit(`http://localhost:8005/${TAB}?mock&smockSleepTime=0&selectedCdnId=${CDN_ID}`);

    cy.getCypressCdn();

    cy.mockRequest({
      method: "GET",
      url: `${CDNS_URL}${CDN_ID}/locations`,
      body: {
        locations: [
          {
            cdnId: CDN_ID,
            description: "Automatically generated location representing the entire CDN",
            entireCdn: true,
            locationId: LOCATION_ID,
            name: "Entire CDN",
          },
          {
            cdnId: CDN_ID,
            description: null,
            entireCdn: false,
            locationId: "location1",
            name: "Test-Location",
          },
        ],
      },
    });

    cy.mockRequest({
      method: "GET",
      url: "https://qn-deployment.cqloud.com/api/2.1/entities/?types=network&entities_list_format=details&contained_in_list_format=none&contains_list_format=none",
      body: {
        entities: [
          {
            attributes: {},
            id: NETWORK_ID,
            name: "RedFoxCorp",
            type: "network",
            uniqueName: "rgnSouthAsia_cnAustralia_nwkRedfoxcorp",
          },
        ],
      },
    });

    cy.mockRequest({
      method: "GET",
      url: `${CDNS_URL}${CDN_ID}/delivery-unit-groups`,
      body: {
        duGroups: [
          {
            duGroupId: "dug1",
            cdnId: CDN_ID,
            name: "empty-group",
            type: "mid",
            longitude: 0.0,
            latitude: 0.0,
            locationId: LOCATION_ID,
            parentDeliveryUnitGroupId: null,
            fallbackDeliveryUnitGroups: [],
            networkId: NETWORK_ID,
          },
          {
            duGroupId: DUG_ID,
            cdnId: CDN_ID,
            name: "test-group",
            type: "mid",
            longitude: 0.0,
            latitude: 0.0,
            locationId: LOCATION_ID,
            parentDeliveryUnitGroupId: null,
            fallbackDeliveryUnitGroups: [],
            networkId: NETWORK_ID,
          },
        ],
      },
    });

    cy.mockRequest({
      method: "GET",
      url: `${CDNS_URL}${CDN_ID}/delivery-units/`,
      body: {
        deliveryUnits: [
          {
            deliveryUnitId: DU_ID,
            networkId: NETWORK_ID,
            cdnId: CDN_ID,
            name: "test-du",
            systemId: "3T0DF5J",
            duGroupId: DUG_ID,
            cacheHashId: "",
            operationalMode: "offline",
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
            monitoringSegmentId: "tester",
            numericId: 2,
            deliveryUnitInterfaces: {},
          },
        ],
      },
    });

    cy.mockRequest({
      method: "GET",
      url: `https://infrastructure.cqloud.com/api/1.0/cdn/caches/?cdn=${CDN_ID}`,
      body: {
        caches: [
          {
            systemId: "testQn007",
            networkId: 0,
            interfaces: [],
          },
          {
            systemId: "testQn008",
            networkId: 0,
            interfaces: [],
          },
          {
            systemId: "59CWH42",
            networkId: 100,
            interfaces: [],
          },
          {
            systemId: "3T0DF5J",
            networkId: 100,
            interfaces: [],
          },
          {
            systemId: "4683ZX1",
            networkId: 100,
            interfaces: [
              {
                interfaceName: "yuval-test-interface",
                ipv4Address: "10.0.0.3",
                ipv6Address: "2001:abc::1",
              },
              {
                interfaceName: "TenGigE0/1",
                ipv4Address: "10.0.0.3",
                ipv6Address: null,
              },
              {
                interfaceName: "yuval-test-interface2",
                ipv4Address: "10.0.0.3",
                ipv6Address: null,
              },
            ],
          },
          {
            systemId: "53GXG62",
            networkId: 100,
            interfaces: [],
          },
        ],
      },
    });
    cy.mockFinished();
  });

  it("should edit test-du", () => {
    cy.validateRequest({ method: "GET", partialHostname: "cdns", path: `/api/1.0/cdns/${CDN_ID}/delivery-units` });

    cy.get(`.grid-rendered [role=row][row-index="2"] .cell-mounted svg[data-icon="edit"]`).parent().click();

    cy.get('[type="submit"]').click();

    cy.validateRequest({
      method: "PUT",
      partialHostname: "cdn",
      path: `/api/1.0/cdns/${CDN_ID}/delivery-units/${DU_ID}`,
      body: {
        name: "test-du",
        systemId: "3T0DF5J",
        duGroupId: DUG_ID,
        cacheHashId: "",
        operationalMode: "offline",
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
        monitoringSegmentId: "tester",
        deliveryUnitInterfaces: {},
      },
    });
  });

  it("should delete test-du", () => {
    cy.validateRequest({ method: "GET", partialHostname: "cdns", path: `/api/1.0/cdns/${CDN_ID}/delivery-units` });

    cy.get(`.grid-rendered [role=row][row-index="2"] .cell-mounted svg[data-icon="trash-alt"]`).parent().click();

    cy.get('[type="submit"]').click();

    cy.validateRequest({
      method: "DELETE",
      partialHostname: "cdn",
      path: `/api/1.0/cdns/${CDN_ID}/delivery-units/${DU_ID}`,
    });
  });
});
