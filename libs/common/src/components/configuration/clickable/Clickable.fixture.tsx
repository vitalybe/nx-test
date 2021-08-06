/* eslint-disable react-hooks/rules-of-hooks */
import * as React from "react";
import styled from "styled-components";
import { Clickable } from "./Clickable";
import FixtureDecorator from "../../../utils/cosmos/FixtureDecorator";

const View = styled(FixtureDecorator)`
  margin: 1em;
  padding: 1em;
  position: relative;
  border: 3px dashed lightgrey;

  width: 300px;
  height: 200px;
`;

function getProps() {
  return {
    onClick: () => {},
    children: "Click Me",
  };
}

export default {
  regular: (
    <View>
      <Clickable {...getProps()}></Clickable>
    </View>
  ),
  disabled: (
    <View>
      <Clickable {...getProps()} isDisabled={true}></Clickable>
    </View>
  ),
  "color override": (
    <View>
      <Clickable {...getProps()} textColor={"green"}></Clickable>
    </View>
  ),
};
