/* eslint-disable react-hooks/rules-of-hooks */
import * as React from "react";
import styled from "styled-components";
import { Button } from "./Button";
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
    children: <div>Click me</div>,
  };
}

export default {
  regular: (
    <View>
      <Button {...getProps()}></Button>
    </View>
  ),
  disabled: (
    <View>
      <Button {...getProps()} isDisabled={true}></Button>
    </View>
  ),
  "color override": (
    <View>
      <Button {...getProps()} backgroundColor={"green"}></Button>
    </View>
  ),
};
