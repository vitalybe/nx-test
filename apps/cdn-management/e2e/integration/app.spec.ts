import { getGreeting } from "../support/app.po";

describe("cdn-management", () => {
  beforeEach(() => cy.visit("/"));

  it("should validate dummy", () => {
    // NOTE: If you don't need tests - Remove the test folder and nx-target
    cy.get("div");
  });
});
