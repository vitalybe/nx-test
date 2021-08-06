/* eslint-disable */
// NOTE: This is duplicated code from mockWrappedproxy - Cypress can't import code, only interfaces
// https://github.com/cypress-io/cypress-webpack-preprocessor/issues/17
import * as _ from "lodash";

Cypress.Commands.add("mockRequest", (mockNetworkRequest) => {
  cy.window().then((win) => {
    const mockResponses = win.mockedNetworkResponses;
    mockResponses.push(mockNetworkRequest);
  });
});

Cypress.Commands.add("validateRequest", (validateBy) => {
  cy.window().then((win) => {
    const expectedRequest = `${validateBy.method.toUpperCase()} - ${validateBy.partialHostname} - ${validateBy.path}`;
    cy.log("searching for request: \n" + expectedRequest);
  });

  cy.window().should((win) => {
    const mockRequests = win.mockedNetworkRequests;
    const foundRequests = findRequests(mockRequests.slice().reverse(), validateBy);

    if (foundRequests.length < 1) {
      const currentRequests = mockRequests.map((request) => {
        const urlObj = new URL(request.url);
        return `${request.method} - ${urlObj.hostname} - ${urlObj.pathname}`;
      });
      throw new Error(`failed to find network request in current requests: \n${currentRequests.join("\n")}`);
    }

    if (validateBy.body) {
      expect(foundRequests[0].body).to.deep.equal(validateBy.body);
    }
  });
});

Cypress.Commands.add("mockFinished", () => {
  cy.window().then((win) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    win.cypressMockFinished = true;
  });
});

function findRequests(mockRequests, findBy) {
  // noinspection DuplicatedCode
  const foundRequests = mockRequests.filter((request) => {
    const url = new URL(request.url);
    const methodEquals = request.method.toUpperCase() === findBy.method.toUpperCase();
    const hostnameIncludes = url.hostname.toLowerCase().includes(findBy.partialHostname.toLowerCase());
    const pathEquals = _.trim(url.pathname.toLowerCase(), "/") === _.trim(findBy.path.toLowerCase(), "/");
    return methodEquals && hostnameIncludes && pathEquals;
  });

  return foundRequests;
}
