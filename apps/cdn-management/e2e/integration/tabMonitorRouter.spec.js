/// <reference types="cypress" />
/* eslint-disable no-undef */

import "../support/index";

const CDN_ID = "9b2d89fe-7078-41e1-89c9-077f041ba480";
const CDN_NAME = "cypress-cdn";
const TAB = "monitors-and-routers";
const PARTIAL_HOSTNAME = "traffic-routers-monitors";

//timeout Should be at least 500ms which is enough time for ag-grid to finish its render
const COMMON_SERVER_MOCK = {
  hostname: "mockItem1",
  systemId: "mockItem1",
  status: "online",
  domain: "mockDomain1",
  ipv4Address: "12.34.56.78",
  ipv6Address: null,
  tcpPort: 80,
  httpsPort: 443,
  segmentId: "mockSegment1",
  httpRouterGroupName: null,
  healthProviderDnsName: null,
  healthProviders: null,
  groupServerDsRemapConfigEnabled: null,
  healthCollectorRegion: "mockRegion1",
};

context("Monitors and Routers tab", () => {
  beforeEach(() => {
    cy.viewport(1300, 660);
    cy.visit(`http://localhost:8005/${TAB}?mock&smockSleepTime=0&selectedCdnId=${CDN_ID}`);

    cy.getCypressCdn();
    cy.mockFinished();
  });

  it("Monitors: Should update status to offline", () => {
    cy.get(`div[type="Monitor"]`).click();

    const TESTED_ID = "e2e test";
    cy.get(`.grid-rendered [role=row][row-index="0"] .cell-mounted [data-icon="edit"]`).click();
    cy.get(`[class*="EditorContent"] input[name="Segment ID"]`).clear().type(TESTED_ID);
    cy.get('[type="submit"]').click();

    cy.validateRequest({
      method: "PUT",
      partialHostname: PARTIAL_HOSTNAME,
      path: `/api/2/cdns/${CDN_NAME}/monitors/tc-dng1.cqloud.com`,
      body: {
        groupServerDsRemapConfigEnabled: true,
        segmentId: TESTED_ID,
        status: "online",
      },
    });
  });

  it("DNS Routers: Should update status to offline", () => {
    cy.get(`div[type="DNS Router"]`).click();

    const TESTED_ID = "e2e test";
    cy.get(`.grid-rendered [role=row][row-index="0"] .cell-mounted [data-icon="edit"]`).click();
    cy.get(`[class*="EditorContent"] input[name="DNS Routing Segment ID"]`).clear().type(TESTED_ID);
    cy.get('[type="submit"]').click();

    cy.validateRequest({
      method: "PUT",
      partialHostname: PARTIAL_HOSTNAME,
      path: `/api/2/cdns/${CDN_NAME}/dns-routers/tc-dng1.cqloud.com`,
      body: {
        dnsRoutingSegmentId: TESTED_ID,
        groupServerDsRemapConfigEnabled: true,
        healthProviders: [
          {
            name: "health1",
            priority: 1,
          },
          {
            name: "health2",
            priority: 2,
          },
        ],
        status: "online",
      },
    });
  });

  it("HTTP Routers: Should update status to offline", () => {
    const TAB_TYPE = "HTTP Router";
    const TESTED_ID = "e2e test";

    cy.get(`div[type="${TAB_TYPE}"]`).click();

    cy.get(`.grid-rendered [role=row][row-index="0"] .cell-mounted [data-icon="edit"]`).click();
    cy.get(`[class*="EditorContent"] input[name="HTTP Router Group Name"]`).clear().type(TESTED_ID);
    cy.get('[type="submit"]').click();

    cy.validateRequest({
      method: "PUT",
      partialHostname: PARTIAL_HOSTNAME,
      path: `/api/2/cdns/${CDN_NAME}/http-routers/tc-dng1.cqloud.com`,
      body: {
        httpRouterGroupName: TESTED_ID,
        groupServerDsRemapConfigEnabled: true,
        healthProviders: [
          {
            name: "health1",
            priority: 1,
          },
          {
            name: "health2",
            priority: 2,
          },
        ],
        status: "online",
      },
    });
  });

  it("Health Collectors: Should update status to offline", () => {
    const TAB_TYPE = "Health Collector";
    const TESTED_ID = "e2e test";

    cy.get(`div[type="${TAB_TYPE}"]`).click();

    cy.get(`.grid-rendered [role=row][row-index="0"] .cell-mounted [data-icon="edit"]`).click();
    cy.get(`[class*="EditorContent"] input[name="Health Collector Region"]`).clear().type(TESTED_ID);
    cy.get('[type="submit"]').click();

    cy.validateRequest({
      method: "PUT",
      partialHostname: PARTIAL_HOSTNAME,
      path: `/api/2/cdns/${CDN_NAME}/health-collectors/tc-dng1.cqloud.com`,
      body: {
        healthCollectorRegion: TESTED_ID,
        groupServerDsRemapConfigEnabled: true,
        status: "online",
      },
    });
  });
});
