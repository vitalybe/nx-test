import * as React from "react";
import styled from "styled-components";
import { CardIspLocation, Props } from "src/card/cardIspLocation/CardIspLocation";
import { CardIspLocationModel } from "src/card/cardIspLocation/cardIspLocationModel";
import { mockUtils } from "common/utils/mockUtils";

import FixtureDecorator from "common/utils/cosmos/FixtureDecorator";

const View = styled(FixtureDecorator)`
  height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

function getProps(): Props {
  return {
    model: CardIspLocationModel.createMock(),
    onClose: mockUtils.mockAction("onClose"),
  };
}

export default {
  Regular: (
    <View>
      <CardIspLocation {...getProps()} />
    </View>
  ),
};
