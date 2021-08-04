import * as React from "react";
import styled from "styled-components";
import { CardGeo, Props } from "src/card/cardGeo/CardGeo";
import { mockUtils } from "common/utils/mockUtils";
import { CardGeoModel } from "src/card/cardGeo/cardGeoModel";

import FixtureDecorator from "common/utils/cosmos/FixtureDecorator";

const View = styled(FixtureDecorator)`
  height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

function getProps(): Props {
  return {
    model: CardGeoModel.createMock(),
    onClose: mockUtils.mockAction("onClose"),
    onEntityClick: mockUtils.mockAction("onEntityClick"),
  };
}

export default {
  Regular: (
    <View>
      <CardGeo {...getProps()} />
    </View>
  ),
};
