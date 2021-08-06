import { MetadataServiceTypeEnum } from "../../backend/deliveryServices/_types/deliveryServiceMetadataTypes";
import { OnlyData } from "../../utils/typescriptUtils";

export class ContentPublisherEntity {
  id!: string;
  name!: string;
  isps!: {
    id: string;
    uniqueName: string;
    name: string;
  }[];
  deliveryServices!: {
    id: string;
    name: string;
    type: MetadataServiceTypeEnum;
  }[];
  iconUrl?: string;

  constructor(data: OnlyData<ContentPublisherEntity>) {
    Object.assign(this, data);
  }

  static createMock(overrides?: Partial<ContentPublisherEntity>) {
    return new ContentPublisherEntity({
      id: "1",
      name: "Steam Software",
      deliveryServices: [],
      isps: [],
      ...overrides,
    });
  }
}
