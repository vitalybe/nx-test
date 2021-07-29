import * as React from "react";
import styled, { css } from "styled-components";
import { loggerCreator } from "common/utils/logger";
import { WorkflowEntity } from "src/workflowStatus/_domain/workflowEntity";
import { StepEntity, StepStateEnum } from "src/workflowStatus/_domain/stepEntity";
import { StatusPartRaw } from "src/workflowStatus/_parts/statusPart/statusPartRaw/StatusPartRaw";
import { Colors } from "src/_styling/colors";
import { CommonStyles } from "common/styling/commonStyles";
import { openQwiltModal } from "common/components/qwiltModal/QwiltModal";
import {
  useWorkflowStore,
  WorkflowStore,
  WorkflowStoreContextProvider,
} from "src/workflowStatus/_stores/workflowStore";
import { TextTooltip } from "common/components/textTooltip/TextTooltip";
import { UserStore } from "common/stores/userStore";
import { ProjectUrlStore } from "src/_stores/projectUrlStore";
import { WizardDiffUpdate } from "src/workflowStatus/wizardDiffUpdate/WizardDiffUpdate";
import { ProjectUrlParams } from "src/_stores/projectUrlParams";
import { ContextDiffContainer } from "src/workflowStatus/contextDiff/ContextDiffContainer";
import { ProvisionFlowsApi, ProvisionFlowsStepsEnum } from "common/backend/provisionFlows";
import { SystemUpdateInternalProvider } from "common/components/_projectSpecific/systemUpdatesManagement/_providers/systemUpdateInternalProvider";
import { SystemUpdateSchemaType } from "common/components/_projectSpecific/systemUpdatesManagement/_domain/systemUpdateSchema";
import { WorkflowStatusProvider } from "src/workflowStatus/workflowStatusBar/_providers/workflowStatusProvider";

const moduleLogger = loggerCreator(__filename);

//region [[ Styles ]]

const Button = styled.div<{ isDisabled: boolean }>`
  ${(props) => CommonStyles.clickableStyle("color", Colors.MATISSE, { isDisabled: props.isDisabled })};

  @keyframes flash {
    0% {
      filter: brightness(100%);
    }
    50% {
      filter: brightness(200%);
    }
    100% {
      filter: brightness(100%);
    }
  }

  ${(props) =>
    !props.isDisabled
      ? css`
          animation: flash linear 0.5s infinite;
        `
      : ""};

  &:hover {
    animation: unset;
  }
`;

//endregion [[ Styles ]]

export interface Props {
  workflow: WorkflowEntity;
  step: StepEntity;
  showTextLabel: boolean;

  className?: string;
}

export const StatusPart = (props: Props) => {
  const store = useWorkflowStore();

  let shownLastStatus: "regular" | "paused";
  if (props.step.state === StepStateEnum.PAUSED) {
    shownLastStatus = "paused";
  } else {
    shownLastStatus = "regular";
  }

  const overrideAuthor = ProjectUrlStore.getInstance().getParamExists(ProjectUrlParams.workflowOverrideAuthor);
  const isWorkflowAuthor =
    (UserStore.instance.isSuperUser && overrideAuthor) ||
    props.workflow.user.toLowerCase() === UserStore.instance.cqloudUserInfo?.email;

  return {
    regular: <StatusPartRaw step={props.step} showTextLabel={props.showTextLabel} className={props.className} />,
    paused: (
      <TextTooltip content={`Pending approval of original author: ${props.workflow.user}`} disabled={isWorkflowAuthor}>
        <Button
          isDisabled={!isWorkflowAuthor}
          onClick={isWorkflowAuthor ? () => onOpenDiff(store, props.workflow, props.step) : undefined}
          className={props.className}>
          <StatusPartRaw step={props.step} showTextLabel={props.showTextLabel} />
        </Button>
      </TextTooltip>
    ),
  }[shownLastStatus];
};

//region [[ Functions ]]
function onOpenDiff(store: WorkflowStore, workflow: WorkflowEntity, step: StepEntity) {
  if (step.stepId === ProvisionFlowsStepsEnum.SNAPSHOT_REPRESENTATION) {
    openRepresentationDiff(store, workflow, step);
  } else if (step.stepId === ProvisionFlowsStepsEnum.SNAPSHOT_PREVIEW) {
    openPreviewDiff(store, workflow);
  }
}

function openPreviewDiff(store: WorkflowStore, workflow: WorkflowEntity) {
  // noinspection JSIgnoredPromiseFromCall
  openQwiltModal((closeModalWithResult) => (
    <WorkflowStoreContextProvider store={store}>
      <ContextDiffContainer
        left={undefined}
        right={workflow}
        cdn={store.cdn}
        isReviewEnabled={true}
        workflowControlEvents={{
          onContinueWorkflow: async (segmentIds: string[]) => {
            await ProvisionFlowsApi.instance.createActionResume(
              store.cdn.id,
              workflow.id,
              ProvisionFlowsStepsEnum.SNAPSHOT_REPRESENTATION,
              segmentIds
            );
          },
          onStopWorkflow: async () => {
            await WorkflowStatusProvider.instance.stopWorkflow(store.cdn.id, workflow.id);
          },
        }}
        onClose={(toRefresh) => {
          if (toRefresh) {
            WorkflowStatusProvider.instance.prepareQuery(store.cdn.id).invalidateWithChildren();
          }

          closeModalWithResult();
        }}
      />
    </WorkflowStoreContextProvider>
  ));
}

function openRepresentationDiff(store: WorkflowStore, workflow: WorkflowEntity, step: StepEntity) {
  const cdnId = store.cdn.id;

  // noinspection JSIgnoredPromiseFromCall
  openQwiltModal((closeModalWithResult) => (
    <WorkflowStoreContextProvider store={store}>
      <WizardDiffUpdate
        cdnId={cdnId}
        workflow={workflow}
        diffMetadata={{
          cdnId: cdnId,
          stepId: step.stepId,
          rightWorkflow: workflow,
          leftWorkflow: undefined,
        }}
        onCreateSystemUpdate={async (systemUpdate: SystemUpdateSchemaType) => {
          await SystemUpdateInternalProvider.instance.create(systemUpdate);
        }}
        onContinueWorkflow={async () => {
          await ProvisionFlowsApi.instance.createActionResume(cdnId, workflow.id, undefined, []);
        }}
        onStopWorkflow={async () => {
          await WorkflowStatusProvider.instance.stopWorkflow(cdnId, workflow.id);
        }}
        onClose={(toRefresh) => {
          if (toRefresh) {
            WorkflowStatusProvider.instance.prepareQuery(store.cdn.id).invalidateWithChildren();
          }

          closeModalWithResult();
        }}
      />
    </WorkflowStoreContextProvider>
  ));
}
//endregion [[ Functions ]]
