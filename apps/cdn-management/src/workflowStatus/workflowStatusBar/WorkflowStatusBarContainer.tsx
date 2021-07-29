import * as _ from "lodash";
import * as React from "react";
import { useRef } from "react";
import styled from "styled-components";
import { loggerCreator } from "common/utils/logger";
import { WorkflowEntity } from "src/workflowStatus/_domain/workflowEntity";
import { WorkflowStore, WorkflowStoreContextProvider } from "src/workflowStatus/_stores/workflowStore";
import { observer } from "mobx-react-lite";
import { WorkflowStatusProvider } from "src/workflowStatus/workflowStatusBar/_providers/workflowStatusProvider";
import { CdnEntity } from "src/_domain/cdnEntity";
import { QueryDataContainer } from "common/components/queryDataContainer/QueryDataContainer";
import { WorkflowStatusBar } from "src/workflowStatus/workflowStatusBar/WorkflowStatusBar";
import { Utils } from "common/utils/utils";

const moduleLogger = loggerCreator(__filename);

//region [[ Styles ]]

const QueryDataContainerStyled = styled(QueryDataContainer)`
  display: grid;

  // Prevent child (fixed) error div to grow beyond the parent by creating a new stacking frame
  // https://stackoverflow.com/a/38268846/126574
  transform: translate3d(0, 0, 0);
` as typeof QueryDataContainer;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  cdn: CdnEntity;
  className?: string;
}

//endregion [[ Props ]]

export const WorkflowStatusBarContainer = observer((props: Props) => {
  const { statusQuery, store } = useStoreAndData(props.cdn);

  store.isCdnLocked = statusQuery.data?.isCdnLocked ?? false;

  return (
    <QueryDataContainerStyled
      className={props.className}
      queryMetadata={statusQuery}
      options={{ loadingBackground: "transparent" }}>
      {(data) => {
        const workflows = data.workflows;
        const newestWorkflow: WorkflowEntity | undefined = _.orderBy(
          workflows ?? [],
          (workflow) => workflow.startTime.valueOf(),
          "desc"
        )[0];

        return (
          <WorkflowStoreContextProvider store={store}>
            <WorkflowStatusBar isCdnLocked={store.isCdnLocked} displayedWorkflow={newestWorkflow} cdn={props.cdn} />
          </WorkflowStoreContextProvider>
        );
      }}
    </QueryDataContainerStyled>
  );
});

function useStoreAndData(cdn: CdnEntity) {
  const store = useRef(new WorkflowStore(cdn)).current;
  store.cdn = cdn;
  const statusQuery = WorkflowStatusProvider.instance
    .prepareQuery(cdn.id)
    .useQuery({ refetchInterval: Utils.toMillis({ seconds: 10 }) });

  return { store, statusQuery };
}
