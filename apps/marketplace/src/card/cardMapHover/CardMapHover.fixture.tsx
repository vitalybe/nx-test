import * as React from "react";
import styled from "styled-components";
import { CardMapHover, Props } from "./CardMapHover";
import { mockUtils } from "@qwilt/common/utils/mockUtils";
import { CardMapHoverModel } from "./cardMapHoverModel";

import FixtureDecorator from "@qwilt/common/utils/cosmos/FixtureDecorator";
import { MarketplaceEntityHeaderModel } from "../../_parts/marketplaceEntityHeader/marketplaceEntityHeaderModel";

const View = styled(FixtureDecorator)`
  height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

function getProps(overrides?: Partial<CardMapHoverModel>): Props {
  return {
    model: CardMapHoverModel.createMock(overrides),
    onMouseEnter: mockUtils.mockAction("onMouseEnter"),
    onMouseLeave: mockUtils.mockAction("onMouseLeave"),
    onClick: mockUtils.mockAction("onClick"),
  };
}

export default {
  Regular: (
    <View>
      <CardMapHover {...getProps()} />
    </View>
  ),
  "No image": () => {
    const props = getProps({
      marketplaceEntityHeader: MarketplaceEntityHeaderModel.createMock({
        ispImagePath: undefined,
      }),
    });
    return <CardMapHover {...props} />;
  },
  "Long text": () => {
    const props = getProps({
      marketplaceEntityHeader: MarketplaceEntityHeaderModel.createMock({
        ispImagePath: undefined,
        title: "This is a very long country name, why is it called like that",
      }),
    });
    return <CardMapHover {...props} />;
  },
};
