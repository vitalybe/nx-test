/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-console */
import * as React from "react";
import styled from "styled-components";
import {
  DnsRouterEditor,
  Props,
} from "src/selectedCdn/tabs/tabMonitorsAndRouters/subTabs/dnsRoutersTab/dnsRouterEditor/DnsRouterEditor";
import { DnsRouterEntity } from "src/selectedCdn/tabs/tabMonitorsAndRouters/subTabs/dnsRoutersTab/_domain/dnsRouterEntity";
import { SelectedCdnFixtureDecorator } from "src/selectedCdn/tabs/_utils/SelectedCdnFixtureDecorator";

const View = styled(SelectedCdnFixtureDecorator)`
  margin: 1em;
  padding: 1em;
  position: relative;
  border: 3px dashed lightgrey;

  width: 1000px;
  height: 500px;
`;

function getProps(): Props {
  return {
    editedItem: DnsRouterEntity.createMock(),
    cdnName: "CDN Name",
    onClose: () => {},
  };
}

export default {
  regular: (
    <View>
      <DnsRouterEditor {...getProps()}></DnsRouterEditor>
    </View>
  ),
};
