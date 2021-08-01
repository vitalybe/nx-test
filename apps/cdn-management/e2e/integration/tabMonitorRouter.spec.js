/// <reference types="cypress" />

import "../support/index";
import { ServerType } from "../../common/backend/trafficRoutersMonitors/_types/trafficRoutersMonitorsTypes";

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
    cy.visit(`http://localhost:${Cypress.env("APP_PORT")}/${TAB}?mock&smockSleepTime=0&selectedCdnId=${CDN_ID}`);

    cy.getCypressCdn();

    cy.mockRequest({
      method: "GET",
      url: `https://${PARTIAL_HOSTNAME}.cqloud.com/api/1/cdns/${CDN_NAME}/${PARTIAL_HOSTNAME}/servers`,
      body: {
        servers: [
          {
            ...COMMON_SERVER_MOCK,
            type: ServerType.HEALTH_COLLECTOR,
          },
          {
            ...COMMON_SERVER_MOCK,
            type: ServerType.MONITOR,
          },
          {
            ...COMMON_SERVER_MOCK,
            type: ServerType.DNS_ROUTER,
          },
          {
            ...COMMON_SERVER_MOCK,
            type: ServerType.HTTP_ROUTER,
          },
        ],
      },
    });
    cy.mockFinished();
  });

  it("Monitors: Should update status to offline", () => {
    cy.changeServerStateOffline("Monitor");
  });

  it("DNS Routers: Should update status to offline", () => {
    cy.changeServerStateOffline("DNS Router");
  });

  it("HTTP Routers: Should update status to offline", () => {
    cy.changeServerStateOffline("HTTP Router");
  });

  it("Health Collectors: Should update status to offline", () => {
    cy.changeServerStateOffline("Health Collector");
  });
});

Cypress.Commands.add("changeServerStateOffline", (type) => {
  cy.get(`div[type="${type}"]`).click();

  cy.get(".grid-rendered [role=row][row-index=0] .cell-mounted select").last().select("Offline");
  cy.get('[type="submit"]').click();

  cy.validateRequest({
    method: "PUT",
    partialHostname: PARTIAL_HOSTNAME,
    path: `/api/1/cdns/${CDN_NAME}/${PARTIAL_HOSTNAME}/servers/${COMMON_SERVER_MOCK.hostname}`,
    body: {
      status: "offline",
    },
  });
});
