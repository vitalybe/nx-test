import * as React from "react";
import styled from "styled-components";
import { mockUtils } from "@qwilt/common/utils/mockUtils";
import { CardMoreDetailsContainerModel } from "./cardMoreDetailsContainerModel";
import { CardMoreDetailsContainer, Props } from "./CardMoreDetailsContainer";

import FixtureDecorator from "@qwilt/common/utils/cosmos/FixtureDecorator";

const View = styled(FixtureDecorator)`
  height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

function getProps(): Props {
  return {
    model: CardMoreDetailsContainerModel.createMock(),
    onClose: mockUtils.mockAction("onClose"),
  };
}

export default {
  Regular: (
    <View>
      <CardMoreDetailsContainer {...getProps()}>
        <div>Hello!</div>
      </CardMoreDetailsContainer>
    </View>
  ),
};
