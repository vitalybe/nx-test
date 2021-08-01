/// <reference types="cypress" />

import "../support/index";

const CDN_ID = "9b2d89fe-7078-41e1-89c9-077f041ba480";
const TAB = "static-dns";

const DS_ID = "5e3c30469877620001b1b25e";
const DNS_RECORD_ID = "64a25b0e-20a8-4f56-b38d-b9d9e0c3c975";

context("Static DNS tab", () => {
  beforeEach(() => {
    cy.viewport(1300, 660);
    cy.visit(`http://localhost:8005/${TAB}?mock&smockSleepTime=0&selectedCdnId=${CDN_ID}&selectedDs=${DS_ID}`);

    cy.getCypressCdn();

    cy.mockRequest({
      method: "GET",
      url: `https://delivery-services.cqloud.com/api/4.0/delivery-services`,
      body: [
        {
          dsId: DS_ID,
          ownerOrgId: "devorg",
          apiVersion: "4.0.0",
          name: "cypress-cdn",
          description: "",
          isActive: true,
          userData: null,
          dsRevisionDescriptions: [],
        },
      ],
    });

    cy.mockRequest({
      method: "GET",
      url: `https://static-dns.cqloud.com/api/1.0/records`,
      body: {
        staticDnsResponseList: [
          {
            deliveryServiceId: DS_ID,
            cdnId: CDN_ID,
            type: "CNAME_RECORD",
            name: "tester",
            value: "tester",
            ttl: "300",
            dnsRecordId: DNS_RECORD_ID,
            orgId: "devorg",
          },
        ],
      },
    });

    cy.mockFinished();
  });

  it("Should create a new record", () => {
    cy.get("div").contains("Records").parent().find("span").contains("Add").parent().click();

    cy.get('[class*="FormikContainerView"] select').select("A");
    cy.get("input[name=Name]").type("test");
    cy.get("input[name=Value]").type("test");
    cy.get("input[name=TTL]").type("123");

    cy.get('[type="submit"]').click();

    cy.validateRequest({
      method: "POST",
      partialHostname: "static-dns",
      path: `/api/1.0/records`,
      body: {
        deliveryServiceId: DS_ID,
        cdnId: CDN_ID,
        type: "A_RECORD",
        name: "test",
        ttl: "123",
        value: "test",
        dnsRecordId: "",
      },
    });
  });

  it("Should edit tester", () => {
    cy.get(`.grid-rendered [role=row][row-index="0"] .cell-mounted svg[data-icon="edit"]`).parent().click();

    cy.get('[class*="FormikContainerView"] select').select("A");

    cy.get('[type="submit"]').click();

    cy.validateRequest({
      method: "PUT",
      partialHostname: "static-dns",
      path: `/api/1.0/records/${DNS_RECORD_ID}`,
      body: {
        deliveryServiceId: DS_ID,
        cdnId: CDN_ID,
        type: "A_RECORD",
        name: "tester",
        ttl: "300",
        value: "tester",
        dnsRecordId: DNS_RECORD_ID,
      },
    });
  });

  it("Should delete tester", () => {
    cy.get(`.grid-rendered [role=row][row-index="0"] .cell-mounted svg[data-icon="trash-alt"]`).parent().click();

    cy.get('[type="submit"]').click();

    cy.validateRequest({
      method: "DELETE",
      partialHostname: "static-dns",
      path: `/api/1.0/records/${DNS_RECORD_ID}`,
    });
  });
});
