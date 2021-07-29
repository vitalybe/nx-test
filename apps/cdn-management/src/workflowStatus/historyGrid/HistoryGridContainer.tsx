import * as React from "react";
import styled from "styled-components";
import { loggerCreator } from "@qwilt/common/utils/logger";
import { HistoryGrid } from "./HistoryGrid";
import { WorkflowsProvider } from "../_providers/workflowsProvider";
import { StepMetadataProvider } from "../_providers/stepMetadataProvider";
import { observer } from "mobx-react-lite";
import { useWorkflowStore } from "../_stores/workflowStore";
import { PrepareQueryResult } from "@qwilt/common/utils/reactQueryUtils/prepareQueryResult";
import { AjaxMetadata } from "@qwilt/common/utils/ajax";
import { Utils } from "@qwilt/common/utils/utils";
import { QueryDataContainer } from "@qwilt/common/components/queryDataContainer/QueryDataContainer";

const moduleLogger = loggerCreator("__filename");

//region [[ Styles ]]

const HistoryGridContainerView = styled(QueryDataContainer)`
  width: 70vw;
  height: 90vh;
  // without 'grid' the child item won't get the dimensions of the parent
  display: grid;
` as typeof QueryDataContainer;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  onClose: () => void;
  className?: string;
}

//endregion [[ Props ]]

export const HistoryGridContainer = observer((props: Props) => {
  const store = useWorkflowStore();

  const query = new PrepareQueryResult({
    name: "HistoryGridContainer",
    // NOTE: remove if there are no arguments
    // eslint-disable-next-line prefer-rest-params
    params: [store.cdn.id],
    provide: async () => {
      const [workflows, steps] = await Promise.all([
        WorkflowsProvider.instance.provide(store.cdn.id, new AjaxMetadata()),
        StepMetadataProvider.instance.provide(store.cdn.id, new AjaxMetadata()),
      ]);

      return {
        workflows,
        steps,
      };
    },
  }).useQuery({ refetchInterval: Utils.toMillis({ seconds: 10 }), cacheTime: 0 });

  return (
    <HistoryGridContainerView className={props.className} queryMetadata={query}>
      {(data) => (
        <HistoryGrid workflows={data.workflows} steps={data.steps} onClose={props.onClose} cdnName={store.cdn.name} />
      )}
    </HistoryGridContainerView>
  );
});
