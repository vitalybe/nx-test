import * as React from "react";
import styled from "styled-components";
import { PercentileIcon } from "common/components/metrics/icons/percentileIcon/PercentileIcon";
import FixtureDecorator from "common/utils/cosmos/FixtureDecorator";

const View = styled(FixtureDecorator)`
  margin: 1em;
  padding: 1em;
  position: absolute;
  border: 3px dashed lightgrey;
`;

const PercentileIconStyled = styled(PercentileIcon)``;

export default {
  Light: (
    <View>
      <PercentileIconStyled iconTheme={"bright"} />
    </View>
  ),
  Dark: (
    <View>
      <PercentileIconStyled iconTheme={"dark"} />
    </View>
  ),
};
