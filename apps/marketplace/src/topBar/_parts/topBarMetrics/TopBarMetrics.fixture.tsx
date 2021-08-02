import * as React from "react";
import styled from "styled-components";
import { TopBarMetrics, Props } from "src/topBar/_parts/topBarMetrics/TopBarMetrics";
import { MarketplaceMetrics } from "src/_domain/marketplaceMetrics";

const View = styled(FixtureDecorator)`
  height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

import FixtureDecorator from "common/utils/cosmos/FixtureDecorator";

function getProps(): Props {
  return {
    metrics: MarketplaceMetrics.createMock(),
  };
}

export default {
  Regular: (
    <View>
      <TopBarMetrics {...getProps()} />
    </View>
  ),
};
