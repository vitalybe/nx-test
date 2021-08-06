import * as React from "react";
import styled from "styled-components";
import { Props, TabRouter } from "./TabRouter";
import FixtureDecorator from "../../utils/cosmos/FixtureDecorator";

const View = styled(FixtureDecorator)`
  margin: 1em;
  padding: 1em;
  position: absolute;
  border: 3px dashed lightgrey;
  width: 500px;
  height: 500px;
`;

const Temp1 = (props: {}) => <div>Hey Temp1</div>;
const Temp2 = (props: {}) => <div>Hey Temp2</div>;

function getProps(): Props {
  return {
    tabs: [
      { component: <Temp1 />, path: "/temp1", title: "Temp 1", default: true },
      { component: <Temp2 />, path: "/temp2", title: "Temp 2" },
    ],
  };
}

export default {
  "-Regular": (
    <View>
      <TabRouter {...getProps()}></TabRouter>
    </View>
  ),
};
