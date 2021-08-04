import * as React from "react";
import styled from "styled-components";
import { TopBarDropdownIndicator } from "src/topBar/topBarSearch/_parts/topBarDropdownIndicator/TopBarDropdownIndicator";

import FixtureDecorator from "common/utils/cosmos/FixtureDecorator";

const View = styled(FixtureDecorator)`
  height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

function getProps() {
  return {};
}

export default {
  Regular: (
    <View>
      <TopBarDropdownIndicator {...getProps()} />
    </View>
  ),
};
