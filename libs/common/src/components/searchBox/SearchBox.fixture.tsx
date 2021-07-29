/* eslint-disable react-hooks/rules-of-hooks */
import * as React from "react";
import styled from "styled-components";
import { Props, SearchBox } from "./SearchBox";
import FixtureDecorator from "common/utils/cosmos/FixtureDecorator";

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
    initialValue: "",
    onValueChanged: () => {},
  };
}

export default {
  regular: (
    <View>
      <SearchBox {...getProps()}></SearchBox>
    </View>
  ),
};
