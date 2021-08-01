import * as React from "react";
import styled from "styled-components";
import { loggerCreator } from "common/utils/logger";
import { WorkflowEntity, WorkflowStateEnum } from "src/workflowStatus/_domain/workflowEntity";
import { ErrorBoundary } from "common/components/ErrorBoundary";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons/faPlusCircle";
import { faHistory } from "@fortawesome/free-solid-svg-icons/faHistory";
import { StatusSection } from "src/workflowStatus/workflowStatusBar/statusSection/StatusSection";
import { openConfirmModal, openQwiltModal } from "common/components/qwiltModal/QwiltModal";
import { HistoryGridContainer } from "src/workflowStatus/historyGrid/HistoryGridContainer";
import {
  useWorkflowStore,
  WorkflowStore,
  WorkflowStoreContextProvider,
} from "src/workflowStatus/_stores/workflowStore";
import { IconWithLabel } from "src/workflowStatus/_parts/iconWithLabel/IconWithLabel";
import { ProvisionFlowsApi, ProvisionFlowsStepsEnum } from "common/backend/provisionFlows";
import { Clickable } from "common/components/configuration/clickable/Clickable";
import { TextTooltip } from "common/components/textTooltip/TextTooltip";
import { Constants } from "src/workflowStatus/_util/constants";
import { CdnEntity } from "src/_domain/cdnEntity";
import { useEffect } from "react";
import { DiffOpenUtil } from "src/workflowStatus/_util/diffOpenUtil";
import { WorkflowOpenDialogUrlParam } from "src/workflowStatus/_util/workflowOpenDialogUrlParam";
import { WorkflowStatusProvider } from "src/workflowStatus/workflowStatusBar/_providers/workflowStatusProvider";

const moduleLogger = loggerCreator(__filename);

//region [[ Styles ]]

const WorkflowStatusBarView = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #c7deeb;
  padding: 1rem;
  border-radius: 0 0 10px 10px;
`;

//endregion [[ Styles ]]

const ButtonsSection = styled.div``;

const ClickableStyled = styled(Clickable)`
  display: flex;
  &:not(:last-child) {
    margin-bottom: 10px;
  }
`;

//region [[ Props ]]

export interface Props {
  cdn: CdnEntity;
  isCdnLocked: boolean;
  // These might be undefined only when there are currently no workflows at all
  displayedWorkflow: WorkflowEntity | undefined;

  className?: string;
}

//endregion [[ Props ]]

export const WorkflowStatusBar = (props: Props) => {
  const store = useWorkflowStore();

  useEffect(() => {
    const paramDiffRequest = WorkflowOpenDialogUrlParam.getOpenDiffRequest();
    if (paramDiffRequest) {
      try {
        DiffOpenUtil.openDiffFromUrlParam(store, paramDiffRequest);
      } catch (e) {
        moduleLogger.warn("Failed to open diff from URL param", e);
      }
    } else if (WorkflowOpenDialogUrlParam.getIsOpenHistory()) {
      showHistory(store);
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let disabledReason = "";
  if (props.displayedWorkflow?.state === WorkflowStateEnum.IN_PROGRESS) {
    disabledReason = "Another workflow is already in progress";
  } else if (props.isCdnLocked) {
    disabledReason = Constants.TEXT_REASON_LOCKED;
  }

  return (
    <ErrorBoundary>
      <WorkflowStatusBarView className={props.className}>
        {props.displayedWorkflow ? (
          <StatusSection workflow={props.displayedWorkflow} />
        ) : (
          <div>No workflow available</div>
        )}
        <ButtonsSection>
          <TextTooltip content={disabledReason} isEnabled={!!disabledReason}>
            <ClickableStyled
              isDisabled={!!disabledReason}
              onClick={() => (!!disabledReason ? undefined : onStartWorkflow(store))}>
              <IconWithLabel icon={faPlusCircle}>Start New Workflow</IconWithLabel>
            </ClickableStyled>
          </TextTooltip>
          <ClickableStyled onClick={() => showHistory(store)}>
            <IconWithLabel icon={faHistory}>All Workflows</IconWithLabel>
          </ClickableStyled>
        </ButtonsSection>
      </WorkflowStatusBarView>
    </ErrorBoundary>
  );
};

//region [[ Functions ]]

function showHistory(store: WorkflowStore) {
  // noinspection JSIgnoredPromiseFromCall
  WorkflowOpenDialogUrlParam.setOpenHistory();
  openQwiltModal((closeModalWithResult) => (
    <WorkflowStoreContextProvider store={store}>
      <HistoryGridContainer
        onClose={() => {
          WorkflowOpenDialogUrlParam.clear();
          closeModalWithResult();
        }}
      />
    </WorkflowStoreContextProvider>
  ));
}

async function onStartWorkflow(store: WorkflowStore) {
  await openConfirmModal(
    "Do you want to start a new workflow?\n" +
      "\n" +
      "Note: It will automatically pause for previews and confirmations",
    `Please confirm - ${store.cdn.name}`,
    async () => {
      try {
        await ProvisionFlowsApi.instance.createActionExecute(store.cdn.id, ProvisionFlowsStepsEnum.SNAPSHOT_PREVIEW);
      } finally {
        WorkflowStatusProvider.instance.prepareQuery(store.cdn.id).invalidateWithChildren();
      }
    }
  );
}

//endregion [[ Functions ]]
