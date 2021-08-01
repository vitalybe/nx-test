/// <reference types="cypress" />
/* eslint-disable no-undef */

import "../support/index";

const CDN_ID = "9b2d89fe-7078-41e1-89c9-077f041ba480";
const TAB = "dns-routing-segments";
const DNS_ROUTING_SEGMENT_ID = "tester";

context("DNS Routing Segments tab", () => {
  beforeEach(() => {
    cy.viewport(1300, 660);
    cy.visit(`http://localhost:8005/${TAB}?mock&smockSleepTime=0&selectedCdnId=${CDN_ID}`);

    cy.getCypressCdn();

    cy.mockRequest({
      method: "GET",
      url: `https://cdns.cqloud.com/api/1/cdns/${CDN_ID}/dns-routing-segments`,
      body: {
        dnsRoutingSegments: {
          tester: {
            dnsRoutingSegmentId: DNS_ROUTING_SEGMENT_ID,
            subDomain: "subDomainMock",
          },
        },
      },
    });
    cy.mockFinished();
  });

  it("Should create a dns routing segment", () => {
    cy.validateRequest({ method: "GET", partialHostname: "cdns", path: `/api/1/cdns/${CDN_ID}/${TAB}` });

    cy.get("div").contains("Segments").parent().find("span").contains("Add").parent().click();

    cy.get("input[name=ID]").type("test");
    cy.get('[type="submit"]').click();

    cy.validateRequest({
      method: "POST",
      partialHostname: "cdns",
      path: `/api/1/cdns/${CDN_ID}/${TAB}`,
      body: {
        dnsRoutingSegmentId: "test",
        subDomain: "",
      },
    });
  });

  it("Should edit tester", () => {
    cy.validateRequest({ method: "GET", partialHostname: "cdns", path: `/api/1/cdns/${CDN_ID}/${TAB}` });

    //cy.triggerItemWithActions(true, "Segments", DNS_ROUTING_SEGMENT_ID);

    cy.get("div").contains("Segments").parent().parent().find(`svg[data-icon="edit"]`).parent().click();

    cy.get(`input[name="Sub Domain"]`).type(" edited");
    cy.get('[type="submit"]').click();

    cy.validateRequest({
      method: "PUT",
      partialHostname: "cdn",
      path: `/api/1/cdns/${CDN_ID}/${TAB}/${DNS_ROUTING_SEGMENT_ID}`,
      body: {
        dnsRoutingSegmentId: DNS_ROUTING_SEGMENT_ID,
        subDomain: "subDomainMock edited",
      },
    });
  });

  it("Should delete tester", () => {
    cy.validateRequest({ method: "GET", partialHostname: "cdns", path: `/api/1/cdns/${CDN_ID}/${TAB}` });

    cy.get("div").contains("Segments").parent().parent().find(`svg[data-icon="trash-alt"]`).parent().click();

    cy.get('[type="submit"]').click();

    cy.validateRequest({
      method: "DELETE",
      partialHostname: "cdn",
      path: `/api/1/cdns/${CDN_ID}/${TAB}/${DNS_ROUTING_SEGMENT_ID}`,
    });
  });
});
