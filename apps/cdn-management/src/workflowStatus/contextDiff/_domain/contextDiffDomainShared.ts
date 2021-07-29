import { ContextDiffEntityTypeEnum } from "./contextEntityType";

export interface ContextDiffBaseEntity {
  id: string;
  type: ContextDiffEntityTypeEnum;
  name: string;

  hasModifications: boolean;

  content?:
    | { kind: "known"; children: ContextDiffBaseEntity[] }
    | { kind: "unknown"; children: ContextDiffBaseEntity[] };
}
