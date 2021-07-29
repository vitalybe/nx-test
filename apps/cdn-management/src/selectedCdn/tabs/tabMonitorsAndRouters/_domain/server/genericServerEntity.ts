import { ServerType } from "common/backend/trafficRoutersMonitors/_types/trafficRoutersMonitorsTypes";
import { loggerCreator } from "common/utils/logger";
import {
  ServerEntity,
  ServerEntityParams,
} from "src/selectedCdn/tabs/tabMonitorsAndRouters/_domain/server/serverEntity";

const moduleLogger = loggerCreator(__filename);

interface GenericServerEntityParams extends ServerEntityParams {
  type: ServerType;
  // NOTE: These are deprecated - Prefer specific server type, e.g. HttpRouterEntity
  groupServerDsRemapConfigEnabled: boolean;
  groupName: string;
  segmentId: string;
  healthCollectorRegion: string;
}

export class GenericServerEntity extends ServerEntity {
  constructor(data: GenericServerEntityParams) {
    super(data);
    Object.assign(this, data);
  }

  // Mock
  static createMock(overrides?: Partial<GenericServerEntityParams>) {
    return new GenericServerEntity({
      ...ServerEntity.createMock(),
      type: ServerType.DNS_ROUTER,
      groupServerDsRemapConfigEnabled: true,
      groupName: "group name",
      segmentId: "segment id",
      healthCollectorRegion: "health collector region",
      ...overrides,
    });
  }
}

// utility - merges parameters as class members
export interface GenericServerEntity extends GenericServerEntityParams {}
