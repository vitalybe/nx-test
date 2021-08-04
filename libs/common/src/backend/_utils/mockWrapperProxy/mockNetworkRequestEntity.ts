import { loggerCreator } from "common/utils/logger";

const moduleLogger = loggerCreator(__filename);

// NOTE - It is duplicated inside interface in Cypress - cypress/support/index.d.ts
export class MockNetworkRequestEntity {
  url!: string;
  method!: string | undefined;
  body!: object | undefined;

  constructor(data: Required<MockNetworkRequestEntity>) {
    Object.assign(this, data);
  }
}
