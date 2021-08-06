export interface HealthReporterApiResult {
  types: {
    "DU-Routing-ID": {
      entities: {
        [id: string]: HealthReporterEntityApiType;
      };
    };
  };
}

interface HealthReporterEntityApiType {
  "entity-keys": { [key: string]: string };
  "routing-status": string;
  "routing-status-severity": number;
  "health-status": string;
  "health-status-severity": number;
  "at-epoch": number;
  "health-reasons": HealthReporterReasonsApiType;
  "config-reasons": HealthReporterReasonsApiType;
  inputs: object[];
}

export interface HealthReporterReasonApiType {
  info: string;
  "entity-derived-status": string;
  "entity-derived-severity": number;
}

export type HealthReporterReasonsApiType = { [key: string]: HealthReporterReasonApiType };
