/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-console */
import * as React from "react";
import styled from "styled-components";
import {
  MonetizationBarCell,
  Props,
} from "./MonetizationBarCell";
import FixtureDecorator from "../../../../../../../utils/cosmos/FixtureDecorator";
import { MonetizationColors } from "../../../../_utils/monetizationColors";

const View = styled(FixtureDecorator)`
  margin: 1em;
  padding: 1em;
  position: relative;
  border: 3px dashed lightgrey;

  width: 300px;
  height: 100px;
`;

function getProps(): Props {
  return {
    color: MonetizationColors.CQDA_COLOR,
    relativePeak: 100,
    value: 89,
  };
}

export default {
  regular: (
    <View>
      <MonetizationBarCell {...getProps()} />
    </View>
  ),
};
