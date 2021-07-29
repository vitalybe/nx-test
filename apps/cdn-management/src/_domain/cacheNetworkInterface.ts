import { CdnCacheInterface } from "./qnEntity";

export interface CacheNetworkInterface {
  cacheInterface: CdnCacheInterface | undefined;
  routingName: string;
  hashId: string | null;
  hashCount: number | null;
  hashCountOffset: number | null;
  isEnabled: boolean;
}
