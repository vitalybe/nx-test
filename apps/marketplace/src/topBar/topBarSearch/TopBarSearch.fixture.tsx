import * as React from "react";
import styled from "styled-components";
import { Props, TopBarSearch } from "src/topBar/topBarSearch/TopBarSearch";
import { TopBarSearchModel } from "src/topBar/topBarSearch/topBarSearchModel";

const View = styled(FixtureDecorator)`
  padding: 3em;
  width: 300px;
  background-color: #f7fafb;
`;

import FixtureDecorator from "common/utils/cosmos/FixtureDecorator";

function getProps(): Props {
  return {
    model: TopBarSearchModel.createMock(),
  };
}

export default {
  Regular: (
    <View>
      <TopBarSearch {...getProps()} />
    </View>
  ),
};
