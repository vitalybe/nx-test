import * as React from "react";

import styled from "styled-components";
import { Props, SelectedCdn } from "./SelectedCdn";

import FixtureDecorator from "@qwilt/common/utils/cosmos/FixtureDecorator";

const View = styled(FixtureDecorator)`
  margin: 1em;
  width: 500px;
  border: 3px dashed lightgrey;
`;

function getProps(overrides?: Partial<Props>): Props {
  return {
    ...overrides,
  };
}

export default {
  Regular: (
    <View>
      <SelectedCdn {...getProps()} />
    </View>
  ),
};
