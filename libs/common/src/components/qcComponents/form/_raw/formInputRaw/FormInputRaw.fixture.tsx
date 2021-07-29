/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-console */
import * as React from "react";
import styled from "styled-components";
import { FormInputRaw, Props } from "./FormInputRaw";
import FixtureDecorator from "../../../../../utils/cosmos/FixtureDecorator";

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
    label: "Input label",
    name: "label",
    placeholder: "input label placeholder",
  };
}

export default {
  regular: (
    <View>
      <FormInputRaw {...getProps()} />
    </View>
  ),
  "error state": (
    <View>
      <FormInputRaw {...getProps()} error={"This field is Required"} />
    </View>
  ),
};
