/* eslint-disable no-undef */
import "@qwilt/common/cypress/commonSupport";

Cypress.Commands.add("triggerItemWithActions", (edit, itemCardLabel, itemWithActionLabel) => {
  cy.get("div")
    .contains(itemCardLabel)
    .parent()
    .parent()
    .find("span")
    .contains(itemWithActionLabel)
    .parent()
    .parent()
    .siblings()
    .find("div")
    .then((options) => {
      if (edit) {
        options[0].click();
      } else {
        options[1].click();
      }
    });
});

Cypress.Commands.add("getCypressCdn", () => {
  // @ts-ignore
  cy.mockRequest({
    method: "GET",
    url: "https://cdns.cqloud.com/api/1.0/cdns/",
    body: {
      cdns: [
        {
          cdnId: "9b2d89fe-7078-41e1-89c9-077f041ba480",
          name: "cypress-cdn",
          description: "",
          httpRootHostedZone: "cypress-cdn.cqloud.com",
          httpCdnSubDomain: "",
          httpSubDomain: "",
          dnsRootHostedZone: "cypress-cdn.cqloud.com",
          dnsCdnSubDomain: "",
          dnsSubDomain: "",
          ctrSubDomain: null,
        },
      ],
    },
  });
});
