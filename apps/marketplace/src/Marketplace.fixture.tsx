import * as React from "react";
import styled from "styled-components";
import { Marketplace, Props } from "./Marketplace";
import { MarketplaceModel } from "./marketplaceModel";
import { MarketplaceStore } from "./_stores/marketplaceStore";

import FixtureDecorator from "@qwilt/common/utils/cosmos/FixtureDecorator";

import { MarketplaceEntities } from "./_domain/marketplaceEntity/marketplaceEntities";
import { MarketplaceEntitySelected } from "./_domain/marketplaceEntity/marketplaceEntitySelected";
import { MarketplaceEntityIsp } from "./_domain/marketplaceEntity/marketplaceEntityIsp";
import { MarketplaceEntityGeo } from "./_domain/marketplaceEntity/marketplaceEntityGeo";

function getProps(): Props {
  return {
    model: MarketplaceModel.createMock(),
  };
}

const View = styled(FixtureDecorator)`
  height: 99vh;
`;

export default {
  Regular: (
    <View>
      <Marketplace {...getProps()} />)
    </View>
  ),
  "Selected entities": () => {
    const marketplaceEntities = MarketplaceEntities.createMock();
    const selectedEntities = marketplaceEntities.entities
      .map((entity) => new MarketplaceEntitySelected(entity as MarketplaceEntityGeo | MarketplaceEntityIsp, true))
      .slice(0, 1);
    const marketplaceStore = MarketplaceStore.createMock({
      selectedEntities: selectedEntities,
    });
    return <Marketplace model={new MarketplaceModel(marketplaceStore)} />;
  },
  "Many selected entities": () => {
    const marketplaceEntities = MarketplaceEntities.createMock();
    const selectedEntities = marketplaceEntities.entities.map(
      (entity) => new MarketplaceEntitySelected(entity as MarketplaceEntityGeo | MarketplaceEntityIsp, true)
    );
    const marketplaceStore = MarketplaceStore.createMock({
      selectedEntities: selectedEntities,
    });
    return <Marketplace model={new MarketplaceModel(marketplaceStore)} />;
  },
};
