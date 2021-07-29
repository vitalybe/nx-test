import * as React from "react";
import styled from "styled-components";
import { EditorDnsSegment, Props } from "src/selectedCdn/tabs/tabDnsSegments/editorDnsSegment/EditorDnsSegment";

import { DnsSegmentEntity } from "src/selectedCdn/tabs/tabDnsSegments/_domain/DnsSegmentEntity";

import { SelectedCdnFixtureDecorator } from "src/selectedCdn/tabs/_utils/SelectedCdnFixtureDecorator";
import { CdnEntity } from "src/_domain/cdnEntity";

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
