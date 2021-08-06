import * as React from "react";
import styled from "styled-components";
import { MarketplaceEntityHeader } from "./marketplaceEntityHeader";
import { MarketplaceEntityHeaderModel } from "./marketplaceEntityHeaderModel";

import FixtureDecorator from "@qwilt/common/utils/cosmos/FixtureDecorator";

const View = styled(FixtureDecorator)`
  position: absolute;
  top: 1em;
  left: 1em;
  border: 1px solid black;
`;

export default {
  "Full ISP details": (
    <View>
      <MarketplaceEntityHeader model={MarketplaceEntityHeaderModel.createMock()} />
    </View>
  ),
  "Region name": (
    <View>
      <MarketplaceEntityHeader
        model={MarketplaceEntityHeaderModel.createMock({
          title: "Germany",
          location: "EU",
        })}
      />
    </View>
  ),
  "ISP without image": (
    <View>
      <MarketplaceEntityHeader
        model={MarketplaceEntityHeaderModel.createMock({
          title: "My ISP",
          location: "USA, NY",
        })}
      />
    </View>
  ),
};
