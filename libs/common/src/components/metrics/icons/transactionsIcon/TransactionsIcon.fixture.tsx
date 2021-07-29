import * as React from "react";
import styled from "styled-components";
import { TransactionsIcon } from "./TransactionsIcon";
import FixtureDecorator from "../../../../utils/cosmos/FixtureDecorator";

const View = styled(FixtureDecorator)`
  margin: 1em;
  padding: 1em;
  position: absolute;
  border: 3px dashed lightgrey;
`;

const TransactionsIconStyled = styled(TransactionsIcon)``;

export default {
  Light: (
    <View>
      <TransactionsIconStyled iconTheme={"bright"} />
    </View>
  ),
  Dark: (
    <View>
      <TransactionsIconStyled iconTheme={"dark"} />
    </View>
  ),
};
