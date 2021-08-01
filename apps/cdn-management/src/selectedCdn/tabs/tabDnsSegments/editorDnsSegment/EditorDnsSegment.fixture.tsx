import * as React from "react";
import styled from "styled-components";
import { EditorDnsSegment, Props } from "./EditorDnsSegment";

import { DnsSegmentEntity } from "../_domain/DnsSegmentEntity";

import { SelectedCdnFixtureDecorator } from "../../_utils/SelectedCdnFixtureDecorator";
import { CdnEntity } from "../../../../_domain/cdnEntity";

const View = styled(SelectedCdnFixtureDecorator)`
  margin: 1em;
  width: 400px;
  border: 3px dashed lightgrey;
`;

function getProps(propsOverrides?: Partial<Props>): Props {
  return {
    edit: true,
    cdn: CdnEntity.createMock(),
    onClose: () => {},
    dnsSegment: DnsSegmentEntity.createMock(),
    ...propsOverrides,
  };
}

export default {
  Regular: (
    <View>
      <EditorDnsSegment {...getProps()} />
    </View>
  ),
};
