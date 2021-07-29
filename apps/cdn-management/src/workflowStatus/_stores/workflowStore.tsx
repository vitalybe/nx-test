import * as React from "react";
import { ReactNode, useContext } from "react";
import { loggerCreator } from "common/utils/logger";
import { CdnEntity } from "src/_domain/cdnEntity";

const moduleLogger = loggerCreator(__filename);

export class WorkflowStore {
  constructor(public cdn: CdnEntity) {}

  isCdnLocked: boolean = false;
}

//region [[ Context ]]
const WorkflowStoreContext = React.createContext<WorkflowStore | undefined>(undefined);

export function WorkflowStoreContextProvider(props: { store: WorkflowStore; children: ReactNode }) {
  return <WorkflowStoreContext.Provider value={props.store}>{props.children}</WorkflowStoreContext.Provider>;
}

export function useWorkflowStore(): WorkflowStore {
  const store = useContext(WorkflowStoreContext);
  if (!store) {
    throw new Error(`no store defined`);
  }

  return store;
}
//endregion
