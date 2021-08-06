import * as React from "react";
import styled from "styled-components";
import { CloseButton } from "./CloseButton";

import FixtureDecorator from "../../utils/cosmos/FixtureDecorator";

const View = styled(FixtureDecorator)`
  height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

function getProps() {
  return {
    onClick: () => {},
  };
}

export default {
  Regular: (
    <View>
      <CloseButton {...getProps()} />
    </View>
  ),
};
