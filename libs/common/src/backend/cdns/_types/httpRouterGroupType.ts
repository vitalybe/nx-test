export interface HttpRouterGroupResultType extends HttpRouterGroupType {
  cdnId: string;
  httpRouterGroupId: string;
  _links?: unknown;
}

export interface HttpRouterGroupType {
  httpRouterGroupName: string;
  fallbackGroups: string[];
  ttl: number;
  dnsName: string;
}

export interface HttpRouterGroupsApiResult {
  httpRouterGroups: HttpRouterGroupResultType[];
  _links?: unknown;
}
