export interface QwosVersionsApiResult {
  systems: Record<string, SystemApiType>;
}

export interface SystemApiType {
  qwosVersion: string;
}
