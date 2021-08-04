import * as React from "react";
import styled from "styled-components";
import { DrillDownTableRow, Props } from "src/drillDown/table/row/DrillDownTableRow";
import { DrillDownTableRowModel } from "src/drillDown/table/row/drillDownTableRowModel";

import FixtureDecorator from "common/utils/cosmos/FixtureDecorator";

import { MetricTypesEnum } from "src/_domain/metricTypes";

const View = styled(FixtureDecorator)`
  margin: 1em;
  width: 200px;
`;

function getProps(overrides?: Partial<DrillDownTableRowModel>): Props {
  return {
    model: DrillDownTableRowModel.createMock("1", overrides),
    highlightedMetricsColumn: MetricTypesEnum.AVAILABLE_BW,
  };
}

export default {
  Regular: (
    <View>
      <DrillDownTableRow {...getProps()} />
    </View>
  ),
  Disabled: () => {
    const props = getProps({
      isEnabled: true,
    });
    return <DrillDownTableRow {...props} />;
  },
};
