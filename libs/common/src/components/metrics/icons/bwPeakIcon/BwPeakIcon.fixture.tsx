import * as React from "react";
import styled from "styled-components";
import { BwPeakIcon } from "./BwPeakIcon";
import FixtureDecorator from "../../../../utils/cosmos/FixtureDecorator";

const View = styled(FixtureDecorator)`
  margin: 1em;
  padding: 1em;
  position: absolute;
  border: 3px dashed lightgrey;
`;

const BwPeakIconStyled = styled(BwPeakIcon)``;

export default {
  Light: (
    <View>
      <BwPeakIconStyled iconTheme={"bright"} />
    </View>
  ),
  Dark: (
    <View>
      <BwPeakIconStyled iconTheme={"dark"} />
    </View>
  ),
};
