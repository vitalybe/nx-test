import * as React from "react";
import styled from "styled-components";
import { BwAvgIcon } from "common/components/metrics/icons/bwAvgIcon/BwAvgIcon";
import FixtureDecorator from "common/utils/cosmos/FixtureDecorator";

const View = styled(FixtureDecorator)`
  margin: 1em;
  padding: 1em;
  position: absolute;
  border: 3px dashed lightgrey;
`;

const BwAvgIconStyled = styled(BwAvgIcon)``;

export default {
  Light: (
    <View>
      <BwAvgIconStyled iconTheme={"bright"} />
    </View>
  ),
  Dark: (
    <View>
      <BwAvgIconStyled iconTheme={"dark"} />
    </View>
  ),
};
