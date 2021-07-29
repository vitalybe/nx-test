export interface MediaSitePackSiteData {
  iconUrl: string;
  id: string;
  name: string;
  reportBitrate: boolean;
  type: string;
}

export interface MediaSitePackAllSitesData {
  sites: MediaSitePackSiteData[];
}
