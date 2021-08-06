import * as React from "react";
import styled from "styled-components";
import { NoDataFallback, Props } from "./NoDataFallback";
import FixtureDecorator from "../../../utils/cosmos/FixtureDecorator";

const View = styled(FixtureDecorator)`
  margin: 1em;
  padding: 1em;
  position: absolute;
  border: 3px dashed lightgrey;
  width: 400px;
  height: 300px;
`;

function getProps(): Props {
  return {};
}

export default {
  "-Regular": (
    <View>
      <NoDataFallback {...getProps()} />
    </View>
  ),
};
