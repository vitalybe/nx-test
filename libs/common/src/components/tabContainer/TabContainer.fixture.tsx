import * as React from "react";
import styled from "styled-components";
import { mockUtils } from "common/utils/mockUtils";
import { Props, TabContainer } from "common/components/tabContainer/TabContainer";

import FixtureDecorator from "common/utils/cosmos/FixtureDecorator";

const View = styled(FixtureDecorator)`
  margin: 0.5em;
`;

function getProps(): Props {
  return {
    tabNames: ["Hello", "Goodbye", "What"],
    initialTabIndex: 0,
    onTabChange: mockUtils.mockAction("onTabChange"),
  };
}

export default {
  Regular: (
    <View>
      <TabContainer {...getProps()}>
        <div>Hello content</div>
        <div>Goodbye content</div>
        <div>What content</div>
      </TabContainer>
    </View>
  ),
};
