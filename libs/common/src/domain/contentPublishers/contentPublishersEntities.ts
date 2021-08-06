import _ from "lodash";
import { ContentPublisherEntity } from "./contentPublisherEntity";

export interface EntitiesRestrictionsObject {
  ispIds?: string[];
  cpIds?: string[];
  dsIds?: string[];
}

export class ContentPublishersEntities {
  constructor(
    public contentPublishers: ContentPublisherEntity[],
    public restrictions: EntitiesRestrictionsObject = {} //initialized for easy mutation if needed
  ) {}

  get selectedContentPublishers() {
    if (this.restrictions?.cpIds || this.restrictions?.ispIds) {
      return this.contentPublishers.filter(cp => {
        if (this.restrictions?.cpIds) {
          return this.restrictions?.cpIds!.includes(cp.id);
        }
        if (this.restrictions?.ispIds) {
          return cp.isps.some(({ id }) => this.restrictions?.ispIds!.includes(id.toString()));
        }
        return true;
      });
    }
    return this.contentPublishers;
  }

  get networks() {
    return _.uniqBy(
      this.selectedContentPublishers
        .flatMap(cp => cp.isps)
        .filter(network => !this.restrictions?.ispIds || this.restrictions?.ispIds.includes(network.id.toString())),
      item => item.id
    );
  }

  get deliveryServices() {
    return _.uniqBy(
      this.selectedContentPublishers.flatMap(cp => cp.deliveryServices),
      item => item.id
    );
  }

  get selectedDeliveryServices() {
    return this.deliveryServices.filter(({ id }) => !this.restrictions?.dsIds || this.restrictions.dsIds.includes(id));
  }

  getCpsOfNetwork({ uniqueName }: { uniqueName: string }) {
    return this.selectedContentPublishers.filter(cp => cp.isps.some(item => item.uniqueName === uniqueName));
  }

  getNetworksOfDs({ id }: { id: string }) {
    return this.networks.filter(network => {
      return this.getCpsOfNetwork(network).some(cp => {
        return cp.deliveryServices.some(site => site.id === id);
      });
    });
  }

  getDsOfNetwork({ uniqueName }: { uniqueName: string }) {
    return this.deliveryServices.filter(ds => {
      return this.getNetworksOfDs(ds).some(network => network.uniqueName === uniqueName);
    });
  }

  // Mock
  static createMock() {
    return new ContentPublishersEntities([ContentPublisherEntity.createMock(), ContentPublisherEntity.createMock()]);
  }
}
