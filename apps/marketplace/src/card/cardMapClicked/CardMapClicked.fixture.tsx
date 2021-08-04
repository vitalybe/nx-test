import * as React from "react";
import styled from "styled-components";
import { CardMapClicked, Props } from "src/card/cardMapClicked/cardMapClicked";
import { MarketplaceMetrics } from "src/_domain/marketplaceMetrics";
import { CardMapClickedModel } from "src/card/cardMapClicked/cardMapClickedModel";

import FixtureDecorator from "common/utils/cosmos/FixtureDecorator";

import { CardSharedTopModel } from "src/card/_parts/cardSharedTop/cardSharedTopModel";
import { MarketplaceEntityHeaderModel } from "src/_parts/marketplaceEntityHeader/marketplaceEntityHeaderModel";

const View = styled(FixtureDecorator)`
  height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

function getProps(overrides?: Partial<CardMapClickedModel>): Props {
  return {
    model: CardMapClickedModel.createMock(overrides),
    showArrow: true,
    onMoreDetails: () => {},
    onClose: () => {},
  };
}

export default {
  ISP: () => {
    const props = getProps();
    return (
      <View>
        <CardMapClicked {...props} />
      </View>
    );
  },
  "Too long values": () => {
    const props = getProps({
      cardSharedTop: CardSharedTopModel.createMock({
        cardMetrics: new MarketplaceMetrics(
          5_123_135_1235_5_123_13123_13_13,
          5_123_135_1235_5_123_13123_13_13,
          5_123_135_1235_5_123_13123_13_13,
          5_123_135_1235_5_123_13123_13_13
        ),
      }),
    });
    return (
      <View>
        <CardMapClicked {...props} />
      </View>
    );
  },
  Region: () => {
    const props = getProps({
      cardSharedTop: CardSharedTopModel.createMock({
        marketplaceEntityHeader: MarketplaceEntityHeaderModel.createMock({
          title: "Germany",
          ispImagePath: undefined,
        }),
      }),
    });
    return (
      <View>
        <CardMapClicked {...props} />
      </View>
    );
  },
  "Broken image": () => {
    const props = getProps({
      cardSharedTop: CardSharedTopModel.createMock({
        marketplaceEntityHeader: MarketplaceEntityHeaderModel.createMock({
          ispImagePath: "whw",
        }),
      }),
    });
    return (
      <View>
        <CardMapClicked {...props} />
      </View>
    );
  },
  "Loading metrics": () => {
    const props = getProps({
      cardSharedTop: CardSharedTopModel.createMock({
        cardMetrics: undefined,
      }),
    });
    return (
      <View>
        <CardMapClicked {...props} />
      </View>
    );
  },
};
