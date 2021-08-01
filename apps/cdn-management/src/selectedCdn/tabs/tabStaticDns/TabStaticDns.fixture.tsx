import * as React from "react";

import styled from "styled-components";
import { Props, TabStaticDns } from "src/selectedCdn/tabs/tabStaticDns/TabStaticDns";

import { SelectedCdnFixtureDecorator } from "src/selectedCdn/tabs/_utils/SelectedCdnFixtureDecorator";
import { DeliveryServiceEntity } from "src/_domain/deliveryServiceEntity";
import { StaticDnsEntity } from "src/selectedCdn/tabs/tabStaticDns/_domain/staticDnsEntity";

const View = styled(SelectedCdnFixtureDecorator)`
  margin: 1em;
  padding: 1em;
  position: absolute;
  border: 3px dashed lightgrey;
`;

function getProps(propsOverrides?: Partial<Props>): Props {
  return {
    deliveryServices: [
      DeliveryServiceEntity.createMock(),
      DeliveryServiceEntity.createMock(),
      DeliveryServiceEntity.createMock(),
    ],
    staticDnsRecords: [StaticDnsEntity.createMock(), StaticDnsEntity.createMock(), StaticDnsEntity.createMock()],
    ...propsOverrides,
  };
}

export default {
  "-Regular": (
    <View>
      <TabStaticDns {...getProps()} />
    </View>
  ),
};
