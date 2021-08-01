/// <reference types="cypress" />

import "../support/index";

const CDN_ID = "9b2d89fe-7078-41e1-89c9-077f041ba480";
const LOCATION_ID = "a40fcebd-b467-4f4f-b5d8-38f7d741f5fb";
const DUG_ID = "05d51a22-abae-43cc-87fa-692a55eb8f0b";
const DU_ID = "15b10213-0c8f-422e-baa0-d43a3ad77cdb";
const TAB = "cache-groups";

const CDNS_URL = "https://cdns.cqloud.com/api/1.0/cdns/";

context("Cache Groups tab", () => {
  beforeEach(() => {
    cy.viewport(1300, 660);
    cy.visit(`http://localhost:${Cypress.env("APP_PORT")}/${TAB}?mock&smockSleepTime=0&selectedCdnId=${CDN_ID}`);

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
      url:
        "https://qn-deployment.cqloud.com/api/2.1/entities/?types=network&entities_list_format=details&contained_in_list_format=none&contains_list_format=none",
      body: {
        entities: [
          {
            attributes: {},
            id: 2816,
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
            networkId: 100,
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
            networkId: 100,
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
            monitoringSegmentId: "tester",
            numericId: 2,
            deliveryUnitInterfaces: {},
          },
        ],
      },
    });
    cy.mockFinished();
  });

  it("should create a new dug", () => {
    cy.validateRequest({
      method: "GET",
      partialHostname: "cdns",
      path: `/api/1.0/cdns/${CDN_ID}/delivery-unit-groups`,
    });

    cy.get("div").contains("Cache Groups").parent().find("span").contains("Add").parent().click();

    cy.get('[class^="FormikContainerView"] label').contains("Network").parent().click();

    cy.get('[class^="OptionContainer"]').contains("network_100").parent().click();

    cy.get("input[name=Name]").type("form");
    cy.get('[type="submit"]').click();

    cy.validateRequest({
      method: "POST",
      partialHostname: "cdns",
      path: `/api/1.0/cdns/${CDN_ID}/delivery-unit-groups`,
      body: {
        fallbackDeliveryUnitGroups: [],
        latitude: 0,
        longitude: 0,
        name: "form",
        networkId: 100,
        parentDeliveryUnitGroupId: null,
        type: "edge",
      },
    });
  });

  it("should edit empty-group", () => {
    cy.validateRequest({
      method: "GET",
      partialHostname: "cdns",
      path: `/api/1.0/cdns/${CDN_ID}/delivery-unit-groups`,
    });

    cy.get(`.grid-rendered [role=row][row-index="2"] .cell-mounted svg[data-icon="edit"]`).parent().click();

    cy.get('[type="submit"]').click();

    cy.validateRequest({
      method: "PUT",
      partialHostname: "cdn",
      path: `/api/1.0/cdns/${CDN_ID}/delivery-unit-groups/dug1`,
      body: {
        fallbackDeliveryUnitGroups: [],
        latitude: 0,
        networkId: 100,
        longitude: 0,
        name: "empty-group",
        parentDeliveryUnitGroupId: null,
        type: "mid",
      },
    });
  });

  it("should delete empty-group", () => {
    cy.validateRequest({
      method: "GET",
      partialHostname: "cdns",
      path: `/api/1.0/cdns/${CDN_ID}/delivery-unit-groups`,
    });

    cy.get(`.grid-rendered [role=row][row-index="2"] .cell-mounted svg[data-icon="trash-alt"]`).parent().click();

    cy.get('[type="submit"]').click();

    cy.validateRequest({
      method: "DELETE",
      partialHostname: "cdn",
      path: `/api/1.0/cdns/${CDN_ID}/delivery-unit-groups/dug1`,
    });
  });
});
