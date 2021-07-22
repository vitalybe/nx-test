export interface MonitorSegmentsApiResult {
  monitoringSegments: Record<string, MonitorSegmentsApiType>;
}

export interface MonitorSegmentsApiType {
  monitoringSegmentId: string;
  healthCollectorSystemIds: string[] | undefined;
}
