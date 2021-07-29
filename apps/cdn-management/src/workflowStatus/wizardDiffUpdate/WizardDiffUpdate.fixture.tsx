/* eslint-disable react-hooks/rules-of-hooks */
import * as React from "react";
import styled from "styled-components";
import { Props, WizardDiffUpdate } from "src/workflowStatus/wizardDiffUpdate/WizardDiffUpdate";
import FixtureDecorator from "common/utils/cosmos/FixtureDecorator";
import { DiffRequestEntity } from "src/workflowStatus/representationDiff/_domain/diffRequestEntity";
import { WorkflowEntity } from "src/workflowStatus/_domain/workflowEntity";

const View = styled(FixtureDecorator)`
  margin: 1em;
  padding: 1em;
  position: relative;
  border: 3px dashed lightgrey;

  width: 1000px;
  height: 500px;
`;

function getProps(): Props {
  return {
    onClose: () => {},
    cdnId: "1",
    diffMetadata: DiffRequestEntity.createMock(),
    workflow: WorkflowEntity.createMock(),
    onContinueWorkflow: () => {},
    onCreateSystemUpdate: () => {},
    onStopWorkflow: () => {},
  };
}

export default {
  regular: (
    <View>
      <WizardDiffUpdate {...getProps()}></WizardDiffUpdate>
    </View>
  ),
};
