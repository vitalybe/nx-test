export interface StatusApiType {
  id: string;
  status: string;
  step: string;
  timestamp: number;
  user: string;
  cdn: string;
}

export interface ConfigWorkflowStatusApiResult {
  running: StatusApiType | null;
  lastSuccess: StatusApiType | null;
  lastFailure: StatusApiType | null;
}

export interface ConfigWorkflowTriggerApiResult {
  id: string;
}
