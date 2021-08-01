import * as React from "react";

import styled from "styled-components";
import { EditorStaticDns, Props } from "src/selectedCdn/tabs/tabStaticDns/editorStaticDns/EditorStaticDns";
import { SelectedCdnFixtureDecorator } from "src/selectedCdn/tabs/_utils/SelectedCdnFixtureDecorator";
import { StaticDnsEntity } from "src/selectedCdn/tabs/tabStaticDns/_domain/staticDnsEntity";
import { CdnEntity } from "src/_domain/cdnEntity";

const View = styled(SelectedCdnFixtureDecorator)`
  margin: 1em;
  width: 400px;
  border: 3px dashed lightgrey;
`;

function getProps(propsOverrides?: Partial<Props>): Props {
  return {
    onClose: () => {},
    editedStaticDns: StaticDnsEntity.createMock(),
    cdn: CdnEntity.createMock(),
    deliveryServiceId: "abc",
    ...propsOverrides,
  };
}

export default {
  Regular: (
    <View>
      <EditorStaticDns {...getProps()} />
    </View>
  ),
};
