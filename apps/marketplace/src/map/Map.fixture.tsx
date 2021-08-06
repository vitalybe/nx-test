import * as React from "react";
import { Map } from "./Map";
import styled from "styled-components";
import { MapModel } from "./mapModel";
import { MarketplaceStore } from "../_stores/marketplaceStore";

import FixtureDecorator from "@qwilt/common/utils/cosmos/FixtureDecorator";

const View = styled(FixtureDecorator)`
  height: 90vh;
`;

export default {
  Regular: () => {
    const marketplace = MarketplaceStore.createMock();
    return (
      <View>
        <Map model={new MapModel(marketplace)} />
      </View>
    );
  },
};
