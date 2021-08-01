import * as React from "react";

import styled from "styled-components";
import { EditorStaticDns, Props } from "./EditorStaticDns";
import { SelectedCdnFixtureDecorator } from "../../_utils/SelectedCdnFixtureDecorator";
import { StaticDnsEntity } from "../_domain/staticDnsEntity";
import { CdnEntity } from "../../../../_domain/cdnEntity";

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
