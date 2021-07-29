import * as React from "react";
import styled from "styled-components";
import { loggerCreator } from "common/utils/logger";
import { StepEntity, StepStateEnum } from "src/workflowStatus/_domain/stepEntity";
import { WorkflowEntity } from "src/workflowStatus/_domain/workflowEntity";
import { StatusPart } from "src/workflowStatus/_parts/statusPart/StatusPart";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DiffRequestEntity } from "src/workflowStatus/representationDiff/_domain/diffRequestEntity";
import { faExchangeAlt } from "@fortawesome/free-solid-svg-icons/faExchangeAlt";
import { Clickable } from "common/components/configuration/clickable/Clickable";
import { Constants } from "src/workflowStatus/_util/constants";
import { useWorkflowStore } from "src/workflowStatus/_stores/workflowStore";
import { ProvisionFlowsStepsEnum } from "common/backend/provisionFlows";
import { DiffOpenUtil } from "src/workflowStatus/_util/diffOpenUtil";

const moduleLogger = loggerCreator(__filename);

//region [[ Styles ]]

const StepGridCellView = styled.div`
  display: flex;
`;

const FontAwesomeIconStyled = styled(FontAwesomeIcon)`
  font-size: ${Constants.ICON_SIZE};
`;

const DiffButton = styled(Clickable)`
  margin-left: 5px;
  display: flex;
  align-items: center;
`;

const DiffLabel = styled.span`
  margin-right: 5px;
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  workflow: WorkflowEntity;
  step: StepEntity;
  comparedWorkflow: WorkflowEntity | undefined;

  className?: string;
}

//endregion [[ Props ]]

export const StepGridCell = (props: Props) => {
  const store = useWorkflowStore();

  const stepsWithData = [ProvisionFlowsStepsEnum.SNAPSHOT_REPRESENTATION, ProvisionFlowsStepsEnum.SNAPSHOT_PREVIEW];
  let diffRequest: DiffRequestEntity | undefined = undefined;
  if (
    // NOTE: For now we only have diff for this step
    stepsWithData.includes(props.step.stepId as ProvisionFlowsStepsEnum) &&
    props.comparedWorkflow &&
    props.workflow !== props.comparedWorkflow
  ) {
    const comparedStep = props.comparedWorkflow.steps.find((step) => step.stepId === props.step.stepId);
    if (comparedStep) {
      const statusesWithData = [StepStateEnum.SUCCESS, StepStateEnum.STOPPED];
      const stepsHaveData =
        statusesWithData.includes(props.step.state) && statusesWithData.includes(comparedStep.state);
      if (stepsHaveData) {
        diffRequest = new DiffRequestEntity({
          cdnId: store.cdn.id,
          leftWorkflow: props.workflow,
          rightWorkflow: props.comparedWorkflow,
          stepId: props.step.stepId,
        });
      }
    }
  }

  return (
    <StepGridCellView className={props.className} onClick={(e) => e.stopPropagation()}>
      <StatusPart workflow={props.workflow} step={props.step} showTextLabel={false} />
      {diffRequest && (
        <DiffButton
          onClick={() => {
            diffRequest && DiffOpenUtil.openDiff(props.step, store, diffRequest);
            // NOTE: stopPropagation doesn't do anything inside ag-grid
          }}>
          <DiffLabel>Diff</DiffLabel>
          <FontAwesomeIconStyled icon={faExchangeAlt} />
        </DiffButton>
      )}
    </StepGridCellView>
  );
};
