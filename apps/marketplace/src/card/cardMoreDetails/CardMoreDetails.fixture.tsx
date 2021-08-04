import * as React from "react";
import styled from "styled-components";
import { CardMoreDetails, Props } from "src/card/cardMoreDetails/CardMoreDetails";
import { CardMoreDetailsModel } from "src/card/cardMoreDetails/cardMoreDetailsModel";
import { mockUtils } from "common/utils/mockUtils";

import FixtureDecorator from "common/utils/cosmos/FixtureDecorator";

import { CardGeoModel } from "src/card/cardGeo/cardGeoModel";
import { MarketplaceEntityIsp } from "src/_domain/marketplaceEntity/marketplaceEntityIsp";
import { CardIspLocationModel } from "src/card/cardIspLocation/cardIspLocationModel";

const View = styled(FixtureDecorator)`
  margin: 1em;
  height: 500px;
`;

function getProps(): Props {
  return {
    model: CardMoreDetailsModel.createMock(),
    onClose: mockUtils.mockAction("onClose"),
    onEntityClick: mockUtils.mockAction("onEntityClick"),
  };
}

export default {
  "ISP details": (
    <View>
      <CardMoreDetails
        {...getProps()}
        model={CardMoreDetailsModel.createMock({
          moreDetailsGeo: undefined,
          moreDetailsIspLocation: CardIspLocationModel.createMock(),
        })}
      />
    </View>
  ),
  "Geo details": (
    <View>
      <CardMoreDetails
        {...getProps()}
        model={CardMoreDetailsModel.createMock({
          moreDetailsGeo: CardGeoModel.createMock(),
          moreDetailsIsp: undefined,
        })}
      />
    </View>
  ),
  "Geo - Many ISPs": (
    <View>
      <CardMoreDetails
        {...getProps()}
        model={CardMoreDetailsModel.createMock({
          moreDetailsGeo: CardGeoModel.createMock({
            ispsInGeo: [
              MarketplaceEntityIsp.createMock("ISP 1"),
              MarketplaceEntityIsp.createMock("ISP 2"),
              MarketplaceEntityIsp.createMock("ISP 3"),
              MarketplaceEntityIsp.createMock("ISP 4"),
              MarketplaceEntityIsp.createMock("ISP 5"),
              MarketplaceEntityIsp.createMock("ISP 6"),
              MarketplaceEntityIsp.createMock("ISP 7"),
              MarketplaceEntityIsp.createMock("ISP 8"),
              MarketplaceEntityIsp.createMock("ISP 9"),
              MarketplaceEntityIsp.createMock("ISP 10"),
              MarketplaceEntityIsp.createMock("ISP 11"),
              MarketplaceEntityIsp.createMock("ISP 12"),
              MarketplaceEntityIsp.createMock("ISP 13"),
              MarketplaceEntityIsp.createMock("ISP 14"),
              MarketplaceEntityIsp.createMock("ISP 15"),
              MarketplaceEntityIsp.createMock("ISP 16"),
              MarketplaceEntityIsp.createMock("ISP 17"),
              MarketplaceEntityIsp.createMock("ISP 18"),
              MarketplaceEntityIsp.createMock("ISP 19"),
              MarketplaceEntityIsp.createMock("ISP 20"),
              MarketplaceEntityIsp.createMock("ISP 21"),
              MarketplaceEntityIsp.createMock("ISP 22"),
              MarketplaceEntityIsp.createMock("ISP 23"),
              MarketplaceEntityIsp.createMock("ISP 24"),
              MarketplaceEntityIsp.createMock("ISP 25"),
              MarketplaceEntityIsp.createMock("ISP 26"),
              MarketplaceEntityIsp.createMock("ISP 27"),
              MarketplaceEntityIsp.createMock("ISP 28"),
              MarketplaceEntityIsp.createMock("ISP 29"),
              MarketplaceEntityIsp.createMock("ISP 30"),
              MarketplaceEntityIsp.createMock("ISP 31"),
              MarketplaceEntityIsp.createMock("ISP 32"),
              MarketplaceEntityIsp.createMock("ISP 33"),
              MarketplaceEntityIsp.createMock("ISP 34"),
              MarketplaceEntityIsp.createMock("ISP 35"),
              MarketplaceEntityIsp.createMock("ISP 36"),
              MarketplaceEntityIsp.createMock("ISP 37"),
              MarketplaceEntityIsp.createMock("ISP 38"),
              MarketplaceEntityIsp.createMock("ISP 39"),
              MarketplaceEntityIsp.createMock("ISP 40"),
            ],
          }),
          moreDetailsIsp: undefined,
        })}
      />
    </View>
  ),
};
