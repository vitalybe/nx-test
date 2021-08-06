import * as React from "react";
import styled from "styled-components";
import { DrillDownTable, Props } from "./DrillDownTable";
import { DrillDownTableModel } from "./drillDownTableModel";
import { MetricTypesEnum } from "../../_domain/metricTypes";

import FixtureDecorator from "@qwilt/common/utils/cosmos/FixtureDecorator";

const View = styled(FixtureDecorator)`
  padding: 1em;
  width: 80%;
  border: 3px dashed lightgrey;
  overflow-x: scroll;
`;

function getProps(overrides?: Partial<DrillDownTableModel>): Props {
  return {
    model: DrillDownTableModel.createMock(overrides),
  };
}

export default {
  "Highlight bandwidth": () => {
    const props = getProps({
      highlightedMetricsColumn: MetricTypesEnum.AVAILABLE_BW,
    });
    return (
      <View>
        <DrillDownTable {...props} />
      </View>
    );
  },
  "Highlight tps": () => {
    const props = getProps({
      highlightedMetricsColumn: MetricTypesEnum.AVAILABLE_TPS,
    });
    return (
      <View>
        <DrillDownTable {...props} />
      </View>
    );
  },
  "Highlight bitrate": () => {
    const props = getProps({
      highlightedMetricsColumn: MetricTypesEnum.BITRATE,
    });
    return (
      <View>
        <DrillDownTable {...props} />
      </View>
    );
  },
  Loading: () => {
    const props = getProps({
      isLoading: true,
    });
    return (
      <View>
        <DrillDownTable {...props} />
      </View>
    );
  },
};
