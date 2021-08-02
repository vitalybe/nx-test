import * as React from "react";
import styled from "styled-components";
import { TopBarMetrics, Props } from "./TopBarMetrics";
import { MarketplaceMetrics } from "../../../_domain/marketplaceMetrics";

const View = styled(FixtureDecorator)`
  height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

import FixtureDecorator from "@qwilt/common/utils/cosmos/FixtureDecorator";

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
