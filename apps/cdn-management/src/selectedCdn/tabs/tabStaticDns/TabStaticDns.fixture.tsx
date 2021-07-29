import * as React from "react";

import styled from "styled-components";
import { Props, TabStaticDns } from "./TabStaticDns";

import { SelectedCdnFixtureDecorator } from "../_utils/SelectedCdnFixtureDecorator";
import { DeliveryServiceEntity } from "../../../_domain/deliveryServiceEntity";
import { StaticDnsEntity } from "./_domain/staticDnsEntity";

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
