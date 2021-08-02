import * as React from "react";
import styled from "styled-components";
import { Props, TopBar } from "./TopBar";
import { TopBarModel } from "./topBarModel";
import { MarketplaceMetrics } from "../_domain/marketplaceMetrics";

import FixtureDecorator from "@qwilt/common/utils/cosmos/FixtureDecorator";

import { MarketplaceStore } from "../_stores/marketplaceStore";
import { PromisedComputedValue } from "computed-async-mobx";

const View = styled(FixtureDecorator)``;

function mockPromisedComputed<T>(value: T, busy: boolean = false): PromisedComputedValue<T> {
  return {
    get: () => value,
    busy: busy,
    refresh: () => {},
  };
}

function getProps(overrides?: Partial<TopBarModel>): Props {
  return {
    model: TopBarModel.createMock(overrides),
  };
}

export default {
  Regular: (
    <View>
      <TopBar {...getProps()} />
    </View>
  ),
  "Selected mode": () => {
    const props = getProps({
      didUserSelectEntities: true,
      selectedMetricsAsync: mockPromisedComputed(MarketplaceMetrics.createMock()),
    });
    return <TopBar {...props} />;
  },
  Loading: () => {
    const props = getProps({
      didUserSelectEntities: true,
      selectedMetricsAsync: mockPromisedComputed(undefined, true),
    });
    return <TopBar {...props} />;
  },
  Interactive: () => {
    const marketplace = MarketplaceStore.createMock();
    return <TopBar {...getProps()} model={new TopBarModel(marketplace)} />;
  },
};
