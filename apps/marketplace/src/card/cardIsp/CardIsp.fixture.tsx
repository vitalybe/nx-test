import * as React from "react";
import styled from "styled-components";
import { CardIsp, Props } from "./CardIsp";
import { CardIspModel } from "./cardIspModel";
import { mockUtils } from "@qwilt/common/utils/mockUtils";

import FixtureDecorator from "@qwilt/common/utils/cosmos/FixtureDecorator";

import { MarketplaceEntityIsp } from "../../_domain/marketplaceEntity/marketplaceEntityIsp";
import * as _ from "lodash";

const View = styled(FixtureDecorator)`
  height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

function getProps(overrides?: Partial<CardIspModel>): Props {
  return {
    model: CardIspModel.createMock(overrides),
    onClose: mockUtils.mockAction("onClose"),
    onEntityClick: mockUtils.mockAction("onEntityClick"),
  };
}

export default {
  Regular: (
    <View>
      <CardIsp {...getProps()} />
    </View>
  ),
  Many: () => {
    const props = getProps({
      ispsInGeo: _.range(10).map((id) => MarketplaceEntityIsp.createMock("Best ISP " + id)),
    });
    return <CardIsp {...props} />;
  },
};
