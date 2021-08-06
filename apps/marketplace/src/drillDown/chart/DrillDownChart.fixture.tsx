import * as React from "react";
import styled from "styled-components";
import { DrillDownChart, Props } from "./DrillDownChart";
import { DrillDownChartModel } from "./drillDownChartModel";

import FixtureDecorator from "@qwilt/common/utils/cosmos/FixtureDecorator";

const View = styled(FixtureDecorator)`
  padding: 1em;
  width: 80%;
  border: 3px dashed lightgrey;
`;

function getProps(overrides?: Partial<DrillDownChartModel>): Props {
  return {
    model: DrillDownChartModel.createMock(overrides),
  };
}

export default {
  Regular: (
    <View>
      <DrillDownChart {...getProps()} />
    </View>
  ),
  Loading: () => {
    const props = getProps({
      isLoading: true,
    });
    return <DrillDownChart {...props} />;
  },
};
