import * as React from "react";

import styled from "styled-components";
import { Props, TopBar } from "src/topBar/TopBar";

import FixtureDecorator from "common/utils/cosmos/FixtureDecorator";
import { CdnEntity } from "src/_domain/cdnEntity";

// eslint-disable-next-line @typescript-eslint/no-unused-vars

const View = styled(FixtureDecorator)`
  margin: 1em;
  width: 200px;
  border: 3px dashed lightgrey;
`;

function getProps(propsOverrides?: Partial<Props>): Props {
  const cdn = CdnEntity.createMock();
  return {
    cdns: [cdn, CdnEntity.createMock(), CdnEntity.createMock()],
    selectedCdn: cdn,
    ...propsOverrides,
  };
}

export default {
  Regular: (
    <View>
      <TopBar {...getProps()} />
    </View>
  ),
};
