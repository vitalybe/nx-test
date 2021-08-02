import * as React from "react";
import styled from "styled-components";
import { Marketplace, Props } from "src/Marketplace";
import { MarketplaceModel } from "src/marketplaceModel";
import { MarketplaceStore } from "src/_stores/marketplaceStore";

import FixtureDecorator from "common/utils/cosmos/FixtureDecorator";

import { MarketplaceEntities } from "src/_domain/marketplaceEntity/marketplaceEntities";
import { MarketplaceEntitySelected } from "src/_domain/marketplaceEntity/marketplaceEntitySelected";
import { MarketplaceEntityIsp } from "src/_domain/marketplaceEntity/marketplaceEntityIsp";
import { MarketplaceEntityGeo } from "src/_domain/marketplaceEntity/marketplaceEntityGeo";

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
