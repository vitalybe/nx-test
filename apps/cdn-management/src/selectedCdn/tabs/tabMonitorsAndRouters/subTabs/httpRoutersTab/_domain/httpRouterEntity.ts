import { loggerCreator } from "common/utils/logger";
import { HealthProviderEntity } from "src/selectedCdn/tabs/tabMonitorsAndRouters/_domain/healthProvider/healthProviderEntity";
import {
  ServerEntity,
  ServerEntityParams,
} from "src/selectedCdn/tabs/tabMonitorsAndRouters/_domain/server/serverEntity";

const moduleLogger = loggerCreator(__filename);

interface HttpRouterEntityParams extends ServerEntityParams {
  healthProviders: HealthProviderEntity[];
  httpRouterGroupName: string;
}

export class HttpRouterEntity extends ServerEntity {
  constructor(data: HttpRouterEntityParams) {
    super(data);
    Object.assign(this, data);
  }

  // Mock
  static createMock(overrides?: Partial<HttpRouterEntityParams>) {
    return new HttpRouterEntity({
      ...ServerEntity.createMock(),
      healthProviders: [HealthProviderEntity.createMock(), HealthProviderEntity.createMock()],
      httpRouterGroupName: "segment.cqloud",
      ...overrides,
    });
  }
}

// utility - merges parameters as class members
export interface HttpRouterEntity extends HttpRouterEntityParams {}
