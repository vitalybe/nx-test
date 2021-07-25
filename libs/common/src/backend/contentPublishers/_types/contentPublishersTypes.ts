export interface NetworkApiType {
  id: number;
  country: string;
  uiName: string;
  uniqueName: string;
  obfuscateName?: string;
}

export interface SiteApiType {
  uiName: string;
  topperName: string;
}

export interface ContentPublisherApiType {
  id: string;
  name: string;
  networks: NetworkApiType[];
  sites: SiteApiType[];
}

export interface ContentPublisherUpdateApiType {
  name: string;
  networksUniqueName: string[];
  topperNames: string[];
}
