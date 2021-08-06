import * as React from "react";
import styled from "styled-components";
import { CardMetrics } from "./CardMetrics";
import { MarketplaceMetrics } from "../../../_domain/marketplaceMetrics";

import FixtureDecorator from "@qwilt/common/utils/cosmos/FixtureDecorator";

const View = styled(FixtureDecorator)`
  height: 90vh;
  width: 350px;
  padding: 2em;
`;

export default {
  Regular: (
    <View>
      <CardMetrics metrics={MarketplaceMetrics.createMock()} />
    </View>
  ),
};
