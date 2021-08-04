import * as React from "react";
import { Map } from "src/map/Map";
import styled from "styled-components";
import { MapModel } from "src/map/mapModel";
import { MarketplaceStore } from "src/_stores/marketplaceStore";

import FixtureDecorator from "common/utils/cosmos/FixtureDecorator";

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
