/* eslint-disable react-hooks/rules-of-hooks */
import * as React from "react";
import styled from "styled-components";
import { Props, WorkflowStatusBar } from "./WorkflowStatusBar";
import { WorkflowEntity } from "../_domain/workflowEntity";
import FixtureStoreDecorator from "../_util/FixtureDecorator";
import { CdnEntity } from "../../_domain/cdnEntity";

const View = styled(FixtureStoreDecorator)`
  margin: 1em;
  padding: 1em;
  position: relative;
  border: 3px dashed lightgrey;

  width: 1000px;
  height: 500px;
`;

function getProps(): Props {
  return { isCdnLocked: false, displayedWorkflow: WorkflowEntity.createMock(), cdn: CdnEntity.createMock() };
}

export default {
  regular: (
    <View>
      <WorkflowStatusBar {...getProps()} />
    </View>
  ),
  "cdn locked": (
    <View>
      <WorkflowStatusBar {...getProps()} isCdnLocked={true} />
    </View>
  ),
};
