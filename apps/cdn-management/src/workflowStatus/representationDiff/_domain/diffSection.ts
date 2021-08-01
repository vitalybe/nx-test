import { JsonDiffEntity } from "src/workflowStatus/_domain/jsonDiffEntity";

export interface DiffSectionDefinition {
  name: string;
  identifierGetter: (obj: Record<string, string>) => string | undefined;
}

export interface DiffSection {
  name: string;
  diff: JsonDiffEntity;
}
