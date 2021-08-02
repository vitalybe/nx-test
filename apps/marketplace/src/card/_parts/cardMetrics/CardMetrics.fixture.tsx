import * as React from "react";
import styled from "styled-components";
import { CardMetrics } from "src/card/_parts/cardMetrics/CardMetrics";
import { MarketplaceMetrics } from "src/_domain/marketplaceMetrics";

const View = styled(FixtureDecorator)`
  height: 90vh;
  width: 350px;
  padding: 2em;
`;

import FixtureDecorator from "common/utils/cosmos/FixtureDecorator";

export default {
  Regular: (
    <View>
      <CardMetrics metrics={MarketplaceMetrics.createMock()} />
    </View>
  ),
};
