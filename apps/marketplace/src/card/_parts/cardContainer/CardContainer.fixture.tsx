import * as React from "react";
import styled from "styled-components";
import { CardContainer } from "src/card/_parts/cardContainer/CardContainer";
import { CardContainerModel } from "src/card/_parts/cardContainer/cardContainerModel";

import FixtureDecorator from "common/utils/cosmos/FixtureDecorator";

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
