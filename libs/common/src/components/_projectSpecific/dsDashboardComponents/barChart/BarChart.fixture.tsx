import * as React from "react";

import styled from "styled-components";
import { BarChart, Props } from "common/components/_projectSpecific/dsDashboardComponents/barChart/BarChart";
import { UnitKindEnum } from "common/utils/unitsFormatter";

import FixtureDecorator from "common/utils/cosmos/FixtureDecorator";

import { BarChartModel } from "common/components/_projectSpecific/dsDashboardComponents/barChart/_types/barChartModel";

const View = styled(FixtureDecorator)`
  width: 600px;
  height: 333px;
  margin: 1em;
  padding: 1em;
  position: absolute;
  border: 3px dashed lightgrey;
`;

function getProps(): Props {
  return {
    data: BarChartModel.createMock().data,
    yAxisOptions: {
      max: 100,
      unitType: UnitKindEnum.PERCENT,
    },
  };
}

export default {
  "-Regular": (
    <View>
      <BarChart {...getProps()} />
    </View>
  ),
  "-Max Bar Width": (
    <View>
      <BarChart {...getProps()} plotOptions={{ maxBarWidth: 25 }} />
    </View>
  ),
  "-Highlighted Children": (
    <View>
      <BarChart {...getProps()} highlightIds={[5, 7]} />
    </View>
  ),
  "-Drilldown Entity": (
    <View>
      <BarChart {...getProps()} drilldownId={1} />
    </View>
  ),
};
