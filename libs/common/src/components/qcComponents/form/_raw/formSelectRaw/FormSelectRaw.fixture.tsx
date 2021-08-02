/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-console */
import * as React from "react";
import styled from "styled-components";
import { FormSelectRaw, Props } from "./FormSelectRaw";
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
    value: "a",
    onChange: () => null,
    options: [
      { value: "a", label: "A" },
      { value: "b", label: "B" },
    ],
  };
}

export default {
  regular: (
    <View>
      <FormSelectRaw {...getProps()} />
    </View>
  ),
  "error state": (
    <View>
      <FormSelectRaw {...getProps()} error={"Must Select a value"} value={""} />
    </View>
  ),
};
