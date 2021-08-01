import * as React from "react";

import styled from "styled-components";
import { Props, TabMonitorsAndRouters } from "src/selectedCdn/tabs/tabMonitorsAndRouters/TabMonitorsAndRouters";

import { SelectedCdnFixtureDecorator } from "src/selectedCdn/tabs/_utils/SelectedCdnFixtureDecorator";

const View = styled(SelectedCdnFixtureDecorator)`
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
      <TabMonitorsAndRouters {...getProps()} />
    </View>
  ),
};
