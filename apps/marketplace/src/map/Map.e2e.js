describe("Map component", () => {
  it("should function normally", function() {
    cy.visitStory(
      "http://localhost:9001/?selectedKind=Map&selectedStory=Regular&full=0&addons=1&stories=1&panelRight=0&addonPanel=storybook%2Factions%2Factions-panel"
    );
  });
});

export const dummy = 0;
