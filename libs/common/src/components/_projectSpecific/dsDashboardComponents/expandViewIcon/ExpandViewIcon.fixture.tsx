import * as React from "react";
import styled from "styled-components";
import { ExpandViewIcon } from "common/components/_projectSpecific/dsDashboardComponents/expandViewIcon/ExpandViewIcon";
import FixtureDecorator from "common/utils/cosmos/FixtureDecorator";

const View = styled(FixtureDecorator)`
  margin: 1em;
  padding: 1em;
  position: absolute;
  border: 3px dashed lightgrey;
`;

const ExpandViewIconStyled = styled(ExpandViewIcon)`
  width: 100%;
  height: 100%;
`;

export default {
  "-collapsed": (
    <View>
      <ExpandViewIconStyled isExpanded={false} />
    </View>
  ),
  "-expanded": (
    <View>
      <ExpandViewIconStyled isExpanded={true} />
    </View>
  ),
};
