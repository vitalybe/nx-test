import * as React from "react";
import styled from "styled-components";
import { DrillDown, Props } from "src/drillDown/DrillDown";
import { DrillDownModel } from "src/drillDown/drillDownModel";
import { MarketplaceStore } from "src/_stores/marketplaceStore";

import FixtureDecorator from "common/utils/cosmos/FixtureDecorator";

import { DrillDownStore } from "src/drillDown/_stores/drillDownStore";

const View = styled(FixtureDecorator)`
  padding: 1em;
  width: 99%;
  margin: 0 auto;
  height: 1000px;
  border: 3px dashed lightgrey;
  overflow-y: scroll;
`;

function getProps(): Props {
  const marketplace = MarketplaceStore.createMock();

  marketplace.marketplaceEntities.entities.forEach((entity, i) => {
    if (i == 1 || i == 5 || i == 7 || i == 10) {
      marketplace.addSelectedEntitiesIds(entity.id);
    }
  });

  return {
    model: new DrillDownModel(new DrillDownStore(marketplace)),
  };
}

export default {
  Regular: (
    <View>
      <DrillDown {...getProps()} />
    </View>
  ),
};
