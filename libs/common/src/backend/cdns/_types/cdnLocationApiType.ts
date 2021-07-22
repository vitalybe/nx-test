export interface CdnLocationEditApiType {
  name: string;
  description?: string | null;
  _links?: unknown;
}

export interface CdnLocationApiType extends CdnLocationEditApiType {
  locationId: string;
  cdnId: string;
  entireCdn: boolean;
}

export interface CdnLocationApiResult {
  locations: CdnLocationApiType[];
  _links?: unknown;
}
