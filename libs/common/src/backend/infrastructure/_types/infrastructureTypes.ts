interface CacheInterfaceApiType {
  interfaceName: string;
  ipv4Address: string | null;
  ipv6Address: string | null;
}

export type CacheApiType = {
  systemId: string;
  networkId: number;
  interfaces: CacheInterfaceApiType[];
};

export type CacheApiResult = {
  caches: CacheApiType[];
};

export interface InfrastructureResponse {
  error?: string;
}
