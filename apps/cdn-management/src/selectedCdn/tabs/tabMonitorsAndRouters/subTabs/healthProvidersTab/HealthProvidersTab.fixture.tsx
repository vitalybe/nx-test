/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-console */
import * as React from "react";
import styled from "styled-components";
import {
  HealthProvidersTab,
  Props,
} from "src/selectedCdn/tabs/tabMonitorsAndRouters/subTabs/healthProvidersTab/HealthProvidersTab";
import FixtureDecorator from "common/utils/cosmos/FixtureDecorator";
import { HealthProviderEntity } from "src/selectedCdn/tabs/tabMonitorsAndRouters/subTabs/healthProvidersTab/_domain/healthProviderEntity";

const View = styled(FixtureDecorator)`
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
    entities: [HealthProviderEntity.createMock(), HealthProviderEntity.createMock(), HealthProviderEntity.createMock()],
  };
}

export default {
  regular: (
    <View>
      <HealthProvidersTab {...getProps()}></HealthProvidersTab>
    </View>
  ),
};
