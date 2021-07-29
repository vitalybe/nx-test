import { ContextDiffEntityTypeEnum } from "src/workflowStatus/contextDiff/_domain/contextEntityType";

export interface ContextDiffBaseEntity {
  id: string;
  type: ContextDiffEntityTypeEnum;
  name: string;

  hasModifications: boolean;

  content?:
    | { kind: "known"; children: ContextDiffBaseEntity[] }
    | { kind: "unknown"; children: ContextDiffBaseEntity[] };
}
