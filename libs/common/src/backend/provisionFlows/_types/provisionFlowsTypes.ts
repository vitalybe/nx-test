interface FlowStepApiType {
  name: string;
  status: {
    flow: "success" | "failure";
    errorLogs: null | string;
    nextOperationalStep?: string | null;
    currentTechnicalStep?: string | null;
    currentOperationalStep?: string | null;
  };
  profiling: null | {
    start: number;
    end: number;
    runTime: number;
  };
  technicalSteps?: unknown;
}
export interface FlowStatusApiType {
  id: string;
  user: string;
  cdnId: string;
  cdnName: string | null;
  startTime: number;
  endTime: number;
  cqEnv: string;
  stopAfter: string;
  status: {
    flow: "success" | "failure" | "canceled";
    errorLogs: string | null;
    currentTechnicalStep?: string | null;
    currentOperationalStep?: string | null;
    nextOperationalStep?: string | null;
  };
  state: "inProgress" | "inProgressPending" | "active" | "nonActive";
  operationalSteps: FlowStepApiType[];
  technicalSteps?: unknown;
}

export interface FlowStatusApiResult {
  provisionFlows: FlowStatusApiType[];
}
export interface StepOutputApiResult {
  [stepId: string]: {
    status: {
      flow: "success" | "failure";
      errorLogs: string;
    };
    output: string;
  };
}

export interface StepsApiResult {
  operationalSteps: string[];
}

export interface ExecutionStatusApiResult {
  cdnId: string;
  runningProvisionFlowId: string;
  activeProvisionFlowId: string;
  lastFailedProvisionFlowId: string;
  locked: boolean;
  flowRunning: boolean;
}
