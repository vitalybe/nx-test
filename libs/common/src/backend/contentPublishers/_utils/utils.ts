import { ContentPublisherApiType } from "../_types/contentPublishersTypes";

export class ContentPublisherUtils {
  static lastId = 0;

  static obfuscateEntities(contentPublisherApiTypes: ContentPublisherApiType[]): ContentPublisherApiType[] {
    this.lastId = 0;
    return contentPublisherApiTypes.map(contentPublisherApiType => this.obfuscateEntity(contentPublisherApiType));
  }

  static obfuscateEntity(contentPublisherApiType: ContentPublisherApiType): ContentPublisherApiType {
    return {
      ...contentPublisherApiType,
      name: "Content Publisher " + this.lastId++,
      networks: contentPublisherApiType.networks.map(network => ({
        ...network,
        obfuscateName: "Network " + this.lastId++,
      })),
      sites: contentPublisherApiType.sites.map(site => ({
        ...site,
        uiName: "Delivery Service " + this.lastId++,
      })),
    };
  }
}
