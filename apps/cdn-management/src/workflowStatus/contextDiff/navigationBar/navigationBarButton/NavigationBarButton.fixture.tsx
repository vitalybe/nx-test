/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-console */
import * as React from "react";
import styled from "styled-components";
import {
  NavigationBarButton,
  Props,
} from "src/workflowStatus/contextDiff/navigationBar/navigationBarButton/NavigationBarButton";
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
    title: "Testing",
    type: ContextDiffEntityTypeEnum.CACHE,
    isSelected: false,
    hasArrow: true,
    onClick: () => {},
  };
}

export default {
  unselected: (
    <View>
      <NavigationBarButton {...getProps()} isSelected={false} />
    </View>
  ),
  selected: (
    <View>
      <NavigationBarButton {...getProps()} isSelected={true} />
    </View>
  ),
  "no entity type": (
    <View>
      <NavigationBarButton {...getProps()} type={undefined} isSelected={true} />
    </View>
  ),
  "long text": (
    <View>
      <NavigationBarButton {...getProps()} title={"sjdkfh sdlfkjhsd fljkshdfjlkhsdf"} />
    </View>
  ),
};
