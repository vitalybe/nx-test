/// <reference types="cypress" />
/* eslint-disable no-undef */

import "../support/index";

const CDN_ID = "9b2d89fe-7078-41e1-89c9-077f041ba480";
const TAB = "ds-assignments";

const DS_ID = "5e3c30469877620001b1b25e";

context("DS Assignments tab", () => {
  beforeEach(() => {
    cy.viewport(1300, 660);
    cy.visit(`http://localhost:8005/${TAB}?mock&smockSleepTime=0&selectedCdnId=${CDN_ID}&selectedDs=${DS_ID}`);

    cy.getCypressCdn();

    cy.mockFinished();
  });

  it("Should delete cypress-cdn assignment rule", () => {
    cy.validateRequest({ method: "GET", partialHostname: "ds-assignments", path: `/api/3.0/ds-assignments/rules` });

    cy.get(`.grid-rendered [role=row][row-index="7"] .cell-mounted svg[data-icon="edit"]`).parent().click();

    // There is some weird re-rendering that happens in the popup that causes cypress to lose the click
    cy.wait(1000);

    cy.get("label").contains("Assignment").parents('[class*="QwiltReactSelect__Container"]').trigger("mousedown");

    cy.get('[class*="OptionContainer"]').contains("inherits").parent().parent().click();

    cy.get('[type="submit"]').click();

    cy.validateRequest({
      method: "DELETE",
      partialHostname: "ds-assignment",
      path: `/api/3.0/ds-assignments/rules/delivery-unit/6`,
    });
  });
});
