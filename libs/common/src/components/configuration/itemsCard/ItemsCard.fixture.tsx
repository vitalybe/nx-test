import * as React from "react";
import styled from "styled-components";
import { ItemsCard, Props } from "common/components/configuration/itemsCard/ItemsCard";
import { mockUtils } from "common/utils/mockUtils";

import FixtureDecorator from "common/utils/cosmos/FixtureDecorator";

const View = styled(FixtureDecorator)`
  margin: 1em;
  width: 400px;
  height: 500px;
`;

const ItemsCardShort = styled(ItemsCard)`
  height: 150px;
`;

function getProps(propsOverrides?: Partial<Props>): Props {
  return {
    title: "Items card",
    onAddButton: mockUtils.mockAction("onAddButton"),
    filter: { onFilter: () => {}, filterValue: "" },
    children: <div />,
    ...propsOverrides,
  };
}

export default {
  Regular: (
    <View>
      <ItemsCard {...getProps()}>
        <div>Dummy content</div>
        <div>Dummy content</div>
        <div>Dummy content</div>
        <div>Dummy content</div>
        <div>Dummy content</div>
      </ItemsCard>
    </View>
  ),
  "No button": (
    <View>
      <ItemsCard {...getProps()} onAddButton={undefined}>
        <div>Dummy content</div>
        <div>Dummy content</div>
        <div>Dummy content</div>
        <div>Dummy content</div>
        <div>Dummy content</div>
      </ItemsCard>
    </View>
  ),
  "Limited height": (
    <View>
      <ItemsCardShort {...getProps()}>
        <div>Dummy content</div>
        <div>Dummy content</div>
        <div>Dummy content</div>
        <div>Dummy content</div>
        <div>Dummy content</div>
      </ItemsCardShort>
    </View>
  ),
  "Limited height, no filter": (
    <View>
      <ItemsCardShort {...getProps()} filter={undefined}>
        <div>Dummy content</div>
        <div>Dummy content</div>
        <div>Dummy content</div>
        <div>Dummy content</div>
        <div>Dummy content</div>
      </ItemsCardShort>
    </View>
  ),
};
