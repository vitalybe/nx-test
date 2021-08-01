/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-console */
import * as React from "react";
import styled from "styled-components";
import { NavigationBar, Props } from "src/workflowStatus/contextDiff/navigationBar/NavigationBar";
import FixtureDecorator from "common/utils/cosmos/FixtureDecorator";
import { ContextDiffEntityTypeEnum } from "src/workflowStatus/contextDiff/_domain/contextEntityType";

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
    buttons: [
      { id: "1", type: undefined, name: "All Changes" },
      { id: "2", type: ContextDiffEntityTypeEnum.NETWORK, name: "Network SP1" },
      { id: "3", type: ContextDiffEntityTypeEnum.CACHE, name: "QN ABC215" },
    ],
    onNavigationButtonClick: () => {},
    toShowEntityNavigation: true,
    onChangeEntity: () => {},
  };
}

export default {
  regular: (
    <View>
      <NavigationBar {...getProps()}></NavigationBar>
    </View>
  ),
};
