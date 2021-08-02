import { loggerCreator } from "common//utils/logger";
import { mockUtils } from "common//utils/mockUtils";
import { LatLng } from "src/_domain/latLng";
import { OnlyData } from "common/utils/typescriptUtils";

const moduleLogger = loggerCreator(__filename);

let id = 0;

export class MarketplaceQnEntity {
  private readonly id: number;
  location!: LatLng;
  isFutureDeployment!: boolean;

  getId() {
    return this.id;
  }

  constructor(data: OnlyData<MarketplaceQnEntity>) {
    Object.assign(this, data);
    this.id = id++;
  }

  // Mock
  static createMock(overrides?: Partial<MarketplaceQnEntity>, id: number = mockUtils.sequentialId()) {
    return new MarketplaceQnEntity({
      location: { lat: 0, lng: 0 },
      isFutureDeployment: false,
      ...overrides,
    });
  }
}
