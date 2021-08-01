/// <reference types="cypress" />

import "../support/index";
import { ServerType } from "@qwilt/common/backend/trafficRoutersMonitors/_types/trafficRoutersMonitorsTypes";

const CDN_ID = "9b2d89fe-7078-41e1-89c9-077f041ba480";
const CDN_NAME = "cypress-cdn";
const TAB = "monitoring-segments";
const MONITORING_SEGMENT_ID = "tester";

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

context("Monitoring segments tab", () => {
  beforeEach(() => {
    cy.viewport(1300, 660);
    cy.visit(`http://localhost:8005/${TAB}?mock&smockSleepTime=0&selectedCdnId=${CDN_ID}`);

    cy.getCypressCdn();

    cy.mockRequest({
      method: "GET",
      url: `https://cdns.cqloud.com/api/1/cdns/${CDN_ID}/monitoring-segments`,
      body: {
        monitoringSegments: [
          {
            monitoringSegmentId: MONITORING_SEGMENT_ID,
            cdnId: CDN_ID,
            region: "gcp-asia-southeast1",
            fallbackSegments: ["asdasd"],
            healthCollectorSystemIds: [],
          },
        ],
      },
    });

    cy.mockRequest({
      method: "GET",
      url: `https://traffic-routers-monitors.cqloud.com/api/1/cdns/${CDN_NAME}/traffic-routers-monitors/servers`,
      body: {
        servers: [
          {
            ...COMMON_SERVER_MOCK,
            type: ServerType.HEALTH_COLLECTOR,
          },
        ],
      },
    });

    cy.mockFinished();
  });

  it("Should create a new monitor segment", () => {
    cy.validateRequest({ method: "GET", partialHostname: "cdns", path: `/api/1/cdns/${CDN_ID}/${TAB}` });

    cy.get("div").contains("Monitor Segments").parent().find("span").contains("Add").parent().click();

    cy.get("input[name=ID]").type("test");
    cy.get('[type="submit"]').click();

    cy.validateRequest({
      method: "POST",
      partialHostname: "cdns",
      path: `/api/1/cdns/${CDN_ID}/${TAB}`,
      body: {
        monitoringSegmentId: "test",
        healthCollectorSystemIds: [],
      },
    });
  });

  it("Should edit tester", () => {
    cy.validateRequest({ method: "GET", partialHostname: "cdns", path: `/api/1/cdns/${CDN_ID}/${TAB}` });

    cy.get(`.grid-rendered [role=row][row-index="0"] .cell-mounted svg[data-icon="edit"]`).parent().click();

    cy.get('[class^="FormikGroupView"]').within(() => {
      cy.get('[class^="ClickableView"]').contains("ADD").click();
    });

    cy.get('[type="submit"]').click();

    cy.validateRequest({
      method: "PUT",
      partialHostname: "cdn",
      path: `/api/1/cdns/${CDN_ID}/${TAB}/${MONITORING_SEGMENT_ID}`,
      body: {
        monitoringSegmentId: MONITORING_SEGMENT_ID,
        healthCollectorSystemIds: [COMMON_SERVER_MOCK.hostname],
      },
    });
  });

  it("Should delete tester", () => {
    cy.validateRequest({ method: "GET", partialHostname: "cdns", path: `/api/1/cdns/${CDN_ID}/${TAB}` });

    cy.get(`.grid-rendered [role=row][row-index="0"] .cell-mounted svg[data-icon="trash-alt"]`).parent().click();
    cy.get('[type="submit"]').click();

    cy.validateRequest({
      method: "DELETE",
      partialHostname: "cdn",
      path: `/api/1/cdns/${CDN_ID}/${TAB}/${MONITORING_SEGMENT_ID}`,
    });
  });
});
