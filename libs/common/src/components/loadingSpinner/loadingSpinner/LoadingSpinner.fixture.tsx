import * as React from "react";
import styled from "styled-components";
import { LoadingSpinner, Props } from "common/components/loadingSpinner/loadingSpinner/LoadingSpinner";
import FixtureDecorator from "common/utils/cosmos/FixtureDecorator";

const View = styled(FixtureDecorator)`
  margin: 1em;
  padding: 1em;
  position: absolute;
  border: 3px dashed lightgrey;
`;

function getProps(propsOverrides?: Partial<Props>): Props {
  return {
    ...propsOverrides,
  };
}

export default {
  "-Regular": (
    <View>
      <LoadingSpinner {...getProps()} />
    </View>
  ),
};
