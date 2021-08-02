import * as React from "react";
import styled from "styled-components";
import { Props, SelectionBarCard } from "src/overview/selectionBar/selectionCard/SelectionBarCard";
import { SelectionBarCardModel } from "src/overview/selectionBar/selectionCard/selectionBarCardModel";
import { MarketplaceEntityHeaderModel } from "src/_parts/marketplaceEntityHeader/marketplaceEntityHeaderModel";

import FixtureDecorator from "common/utils/cosmos/FixtureDecorator";

const View = styled(FixtureDecorator)`
  height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #cccccc;
`;

function getProps(overrides?: Partial<SelectionBarCardModel>, propsOverrides?: Partial<Props>): Props {
  return {
    model: SelectionBarCardModel.createMock(undefined, overrides),
    onClose: () => console.log("onClose"),
    ...propsOverrides,
  };
}

export default {
  Regular: (
    <View>
      <SelectionBarCard {...getProps()} />
    </View>
  ),
  "Region name": () => {
    const selectionCardModel = getProps({
      marketplaceEntityHeaderModel: MarketplaceEntityHeaderModel.createMock({
        title: "Germany",
        ispImagePath: undefined,
      }),
    }).model;
    return <SelectionBarCard {...getProps()} model={selectionCardModel} />;
  },
  "Long name": () => {
    const selectionCardModel = getProps({
      marketplaceEntityHeaderModel: MarketplaceEntityHeaderModel.createMock({
        title: "United Arab Emirates",
        ispImagePath: undefined,
      }),
    }).model;
    return <SelectionBarCard {...getProps()} model={selectionCardModel} />;
  },
  "Too long name": () => {
    const selectionCardModel = getProps({
      marketplaceEntityHeaderModel: MarketplaceEntityHeaderModel.createMock({
        title: "United Arab Emirates Of The Awesome Countries",
        ispImagePath: undefined,
        location: "TX, USA",
      }),
    }).model;
    return <SelectionBarCard {...getProps()} model={selectionCardModel} />;
  },
  Loading: () => {
    const selectionCardModel = getProps({
      cardMetrics: undefined,
    }).model;
    return <SelectionBarCard {...getProps()} model={selectionCardModel} />;
  },
};
