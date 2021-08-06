/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-console */
import * as React from "react";
import styled from "styled-components";
import {
  InputErrorIndication,
  Props,
} from "./InputErrorIndication";
import FixtureDecorator from "../../../../../utils/cosmos/FixtureDecorator";

const View = styled(FixtureDecorator)`
  margin: 1em;
  padding: 1em;
  position: relative;
  border: 3px dashed lightgrey;

  width: 400px;
  height: 40px;
`;

function getProps(): Props {
  return {
    message: "This field is required",
  };
}

export default {
  regular: (
    <View>
      <InputErrorIndication {...getProps()} />
    </View>
  ),
};
