import * as React from "react";
import styled from "styled-components";
import { HitRatioIcon } from "./HitRatioIcon";
import FixtureDecorator from "../../../../utils/cosmos/FixtureDecorator";

const View = styled(FixtureDecorator)`
  margin: 1em;
  padding: 1em;
  position: absolute;
  border: 3px dashed lightgrey;
`;

const HitRatioIconStyled = styled(HitRatioIcon)``;

export default {
  Light: (
    <View>
      <HitRatioIconStyled iconTheme={"bright"} />
    </View>
  ),
  Dark: (
    <View>
      <HitRatioIconStyled iconTheme={"dark"} />
    </View>
  ),
};
