import { loggerCreator } from "common/utils/logger";
import { mockUtils } from "common/utils/mockUtils";

const moduleLogger = loggerCreator(__filename);

export class HttpRouterGroupEntity {
  id!: string;
  name!: string;
  cdnId!: string;
  ttl!: number;
  dnsName!: string;
  fallbackGroups!: HttpRouterGroupEntity[];
  isDeletable!: boolean;

  constructor(data: Required<HttpRouterGroupEntity>) {
    Object.assign(this, data);
  }

  static createMock(overrides?: Partial<HttpRouterGroupEntity>, id: number = mockUtils.sequentialId()) {
    return new HttpRouterGroupEntity({
      id: `${id}`,
      name: `name_${id}`,
      cdnId: `cdn_${id}`,
      ttl: id,
      dnsName: `dnsName_${id}`,
      fallbackGroups: [
        {
          id: `${id + 1}`,
          name: `name_${id + 1}`,
          cdnId: `cdn_${id + 1}`,
          ttl: id + 1,
          dnsName: `dnsName_${id + 1}`,
          fallbackGroups: [],
          isDeletable: false,
        },
      ],
      isDeletable: true,
      ...overrides,
    });
  }
}
