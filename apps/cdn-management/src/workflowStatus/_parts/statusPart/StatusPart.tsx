import * as React from "react";
import styled, { css } from "styled-components";
import { loggerCreator } from "@qwilt/common/utils/logger";
import { WorkflowEntity } from "../../_domain/workflowEntity";
import { StepEntity, StepStateEnum } from "../../_domain/stepEntity";
import { StatusPartRaw } from "./statusPartRaw/StatusPartRaw";
import { Colors } from "../../../_styling/colors";
import { CommonStyles } from "@qwilt/common/styling/commonStyles";
import { openQwiltModal } from "@qwilt/common/components/qwiltModal/QwiltModal";
import {
  useWorkflowStore,
  WorkflowStore,
  WorkflowStoreContextProvider,
} from "../../_stores/workflowStore";
import { TextTooltip } from "@qwilt/common/components/textTooltip/TextTooltip";
import { UserStore } from "@qwilt/common/stores/userStore";
import { ProjectUrlStore } from "../../../_stores/projectUrlStore";
import { WizardDiffUpdate } from "../../wizardDiffUpdate/WizardDiffUpdate";
import { ProjectUrlParams } from "../../../_stores/projectUrlParams";
import { ContextDiffContainer } from "../../contextDiff/ContextDiffContainer";
import { ProvisionFlowsApi, ProvisionFlowsStepsEnum } from "@qwilt/common/backend/provisionFlows";
import { SystemUpdateInternalProvider } from "@qwilt/common/components/_projectSpecific/systemUpdatesManagement/_providers/systemUpdateInternalProvider";
import { SystemUpdateSchemaType } from "@qwilt/common/components/_projectSpecific/systemUpdatesManagement/_domain/systemUpdateSchema";
import { WorkflowStatusProvider } from "../../workflowStatusBar/_providers/workflowStatusProvider";

const moduleLogger = loggerCreator("__filename");

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
