/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-console */
import * as React from "react";
import styled from "styled-components";
import { DnsRoutersTab, Props } from "./DnsRoutersTab";
import { DnsRouterEntity } from "./_domain/dnsRouterEntity";
import { SelectedCdnFixtureDecorator } from "../../../_utils/SelectedCdnFixtureDecorator";

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
    cdnName: "1234",
    entities: [DnsRouterEntity.createMock(), DnsRouterEntity.createMock(), DnsRouterEntity.createMock()],
  };
}

export default {
  regular: (
    <View>
      <DnsRoutersTab {...getProps()}></DnsRoutersTab>
    </View>
  ),
};
