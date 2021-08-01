/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-console */
import * as React from "react";
import styled from "styled-components";
import { DiffFlowTitle, Props } from "src/workflowStatus/_parts/diffFlowTitle/DiffFlowTitle";
import FixtureDecorator from "common/utils/cosmos/FixtureDecorator";
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
    left: WorkflowEntity.createMock(),
    right: WorkflowEntity.createMock(),
  };
}

export default {
  regular: (
    <View>
      <DiffFlowTitle {...getProps()}></DiffFlowTitle>
    </View>
  ),
};
