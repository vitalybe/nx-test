import * as React from "react";

import styled from "styled-components";
import { Props, TabDnsSegments } from "src/selectedCdn/tabs/tabDnsSegments/TabDnsSegments";

import { SelectedCdnFixtureDecorator } from "src/selectedCdn/tabs/_utils/SelectedCdnFixtureDecorator";

// eslint-disable-next-line @typescript-eslint/no-unused-vars

const View = styled(SelectedCdnFixtureDecorator)`
  margin: 1em;
  padding: 1em;
  position: absolute;
  border: 3px dashed lightgrey;
`;

const TabDnsSegmentsStyled = styled(TabDnsSegments)`
  width: 100%;
  height: 100%;
`;

function getProps(propsOverrides?: Partial<Props>): Props {
  return {
    ...propsOverrides,
  };
}

export default {
  "-Regular": (
    <View>
      <TabDnsSegmentsStyled {...getProps()} />
    </View>
  ),
};
