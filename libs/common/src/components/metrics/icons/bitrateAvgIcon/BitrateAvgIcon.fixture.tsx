import * as React from "react";
import styled from "styled-components";
import { BitrateAvgIcon } from "common/components/metrics/icons/bitrateAvgIcon/BitrateAvgIcon";
import FixtureDecorator from "common/utils/cosmos/FixtureDecorator";

const View = styled(FixtureDecorator)`
  margin: 1em;
  padding: 1em;
  position: absolute;
  border: 3px dashed lightgrey;
`;

const BitrateAvgIconStyled = styled(BitrateAvgIcon)``;

export default {
  Light: (
    <View>
      <BitrateAvgIconStyled iconTheme={"bright"} />
    </View>
  ),
  Dark: (
    <View>
      <BitrateAvgIconStyled iconTheme={"dark"} />
    </View>
  ),
};
