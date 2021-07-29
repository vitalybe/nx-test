import { PrepareQueryResult } from "./reactQueryUtils/prepareQueryResult";

export class CommonTestUtils {
  private static mockQueryCounter = 0;

  static getMockQueryResult<T>(provide: () => Promise<T>) {
    // Prevent cache reuse
    this.mockQueryCounter++;

    return new PrepareQueryResult<T>({
      name: "mockQueryCounter" + this.mockQueryCounter,
      provide: provide,
    });
  }
}
