/* eslint-disable react-hooks/rules-of-hooks */
import * as React from "react";
import styled from "styled-components";
import { HistoryGrid, Props } from "src/workflowStatus/historyGrid/HistoryGrid";
import { WorkflowEntity, WorkflowStateEnum } from "src/workflowStatus/_domain/workflowEntity";
import { StepEntity, StepStateEnum } from "src/workflowStatus/_domain/stepEntity";
import { DateTime } from "luxon";
import FixtureStoreDecorator from "src/workflowStatus/_util/FixtureDecorator";
import { ProvisionFlowsStepsEnum } from "common/backend/provisionFlows";

const View = styled(FixtureStoreDecorator)`
  margin: 1em;
  padding: 1em;
  position: relative;
  border: 3px dashed lightgrey;

  width: 1000px;
  height: 500px;
  // without 'grid' the child item won't get the dimensions of the parent
  display: grid;
`;

function getProps(): Props {
  const timestamp = DateTime.fromISO("2018-10-08T21:00:00.000+03:00");

  return {
    steps: [
      { id: ProvisionFlowsStepsEnum.SNAPSHOT_PREVIEW, name: "Preview" },
      { id: ProvisionFlowsStepsEnum.SNAPSHOT_REPRESENTATION, name: "Representation" },
      { id: ProvisionFlowsStepsEnum.SNAPSHOT_PARCELIZE, name: "Parcelization" },
    ],
    workflows: [
      WorkflowEntity.createMock({
        state: WorkflowStateEnum.IN_PROGRESS,
        endTime: undefined,
        steps: [
          StepEntity.createMock({ stepId: ProvisionFlowsStepsEnum.SNAPSHOT_PREVIEW, state: StepStateEnum.SUCCESS }),
          StepEntity.createMock({
            stepId: ProvisionFlowsStepsEnum.SNAPSHOT_REPRESENTATION,
            state: StepStateEnum.SUCCESS,
          }),
          StepEntity.createMock({
            stepId: ProvisionFlowsStepsEnum.SNAPSHOT_PARCELIZE,
            state: StepStateEnum.IN_PROGRESS,
          }),
        ],
      }),
      WorkflowEntity.createMock({
        state: WorkflowStateEnum.ACTIVE,
        endTime: timestamp,
        steps: [
          StepEntity.createMock({ stepId: ProvisionFlowsStepsEnum.SNAPSHOT_PREVIEW, state: StepStateEnum.SUCCESS }),
          StepEntity.createMock({
            stepId: ProvisionFlowsStepsEnum.SNAPSHOT_REPRESENTATION,
            state: StepStateEnum.SUCCESS,
          }),
          StepEntity.createMock({ stepId: ProvisionFlowsStepsEnum.SNAPSHOT_PARCELIZE, state: StepStateEnum.SUCCESS }),
        ],
      }),
      WorkflowEntity.createMock({
        state: WorkflowStateEnum.NOT_ACTIVE,
        endTime: timestamp,
        steps: [
          StepEntity.createMock({ stepId: ProvisionFlowsStepsEnum.SNAPSHOT_PREVIEW, state: StepStateEnum.SUCCESS }),
          StepEntity.createMock({
            stepId: ProvisionFlowsStepsEnum.SNAPSHOT_REPRESENTATION,
            state: StepStateEnum.SUCCESS,
          }),
          StepEntity.createMock({ stepId: ProvisionFlowsStepsEnum.SNAPSHOT_PARCELIZE, state: StepStateEnum.SUCCESS }),
        ],
      }),
      WorkflowEntity.createMock({
        state: WorkflowStateEnum.NOT_ACTIVE,
        endTime: timestamp,
        steps: [
          StepEntity.createMock({ stepId: ProvisionFlowsStepsEnum.SNAPSHOT_PREVIEW, state: StepStateEnum.SUCCESS }),
          StepEntity.createMock({
            stepId: ProvisionFlowsStepsEnum.SNAPSHOT_REPRESENTATION,
            state: StepStateEnum.ERROR,
            error: "All calls stacked themselves",
          }),
        ],
      }),
      WorkflowEntity.createMock({
        state: WorkflowStateEnum.NOT_ACTIVE,
        endTime: timestamp,
        steps: [
          StepEntity.createMock({ stepId: ProvisionFlowsStepsEnum.SNAPSHOT_PREVIEW, state: StepStateEnum.SUCCESS }),
          StepEntity.createMock({
            stepId: ProvisionFlowsStepsEnum.SNAPSHOT_REPRESENTATION,
            state: StepStateEnum.STOPPED,
          }),
        ],
      }),
    ],
    onClose: () => {},
    cdnName: "mockCdn",
  };
}

export default {
  regular: (
    <View>
      <HistoryGrid {...getProps()}></HistoryGrid>
    </View>
  ),
};
