/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-console */
import * as React from "react";
import styled from "styled-components";
import {
  HealthProviders,
  Props,
} from "src/selectedCdn/tabs/tabMonitorsAndRouters/subTabs/_parts/healthProviders/HealthProviders";
import { HealthProviderEntity } from "src/selectedCdn/tabs/tabMonitorsAndRouters/_domain/healthProvider/healthProviderEntity";
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
    entities: [
      HealthProviderEntity.createMock(),
      HealthProviderEntity.createMock(),
      HealthProviderEntity.createMock(),
      HealthProviderEntity.createMock(),
    ],
  };
}

export default {
  regular: (
    <View>
      <HealthProviders {...getProps()}></HealthProviders>
    </View>
  ),
};
