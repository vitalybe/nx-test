import * as React from "react";
import styled from "styled-components";
import { Props, TopBarSearch } from "./TopBarSearch";
import { TopBarSearchModel } from "./topBarSearchModel";

const View = styled(FixtureDecorator)`
  padding: 3em;
  width: 300px;
  background-color: #f7fafb;
`;

import FixtureDecorator from "@qwilt/common/utils/cosmos/FixtureDecorator";

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
