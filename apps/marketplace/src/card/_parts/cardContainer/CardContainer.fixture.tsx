import * as React from "react";
import styled from "styled-components";
import { CardContainer } from "./CardContainer";
import { CardContainerModel } from "./cardContainerModel";

import FixtureDecorator from "@qwilt/common/utils/cosmos/FixtureDecorator";

const View = styled(FixtureDecorator)`
  height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default {
  "Without arrow": (
    <View>
      <CardContainer model={CardContainerModel.createMock()} showArrow={false}>
        <div>Some stuff</div>
      </CardContainer>
    </View>
  ),
  "With arrow": (
    <View>
      <CardContainer model={CardContainerModel.createMock()} showArrow={true}>
        <div>Some stuff</div>
      </CardContainer>
    </View>
  ),
};
