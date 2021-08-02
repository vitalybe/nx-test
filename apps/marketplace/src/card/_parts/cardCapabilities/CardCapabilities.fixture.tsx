import * as React from "react";
import styled from "styled-components";
import { CardCapabilities, Props } from "src/card/_parts/cardCapabilities/CardCapabilities";
import { CardCapabilitiesModel } from "./cardCapabilitiesModel";

import FixtureDecorator from "common/utils/cosmos/FixtureDecorator";

function createProps(): Props {
  return {
    model: new CardCapabilitiesModel(),
  };
}

const View = styled(FixtureDecorator)`
  height: 90vh;
  width: 350px;
`;

export default {
  Regular: (
    <View>
      <CardCapabilities {...createProps()} />
    </View>
  ),
};
