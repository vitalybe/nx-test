/* eslint-disable react-hooks/rules-of-hooks */
import * as React from "react";
import styled from "styled-components";
import { OptionsMenu, Props } from "./OptionsMenu";
import FixtureDecorator from "../../../utils/cosmos/FixtureDecorator";

const OptionsMenuStyled = styled(OptionsMenu)`
  position: absolute;
  top: 16px;
  right: 13px;
`;
const View = styled(FixtureDecorator)`
  margin: 1em;
  padding: 1em;
  position: relative;
  border: 3px dashed lightgrey;

  width: 300px;
  height: 300px;
`;

function getProps(): Props {
  return {
    options: [
      { label: "Edit", callback: () => null },
      { label: "Duplicate", callback: () => null },
      { label: "Delete", callback: () => null },
    ],
  };
}

export default {
  regular: (
    <View>
      <OptionsMenuStyled {...getProps()} />
    </View>
  ),
};
