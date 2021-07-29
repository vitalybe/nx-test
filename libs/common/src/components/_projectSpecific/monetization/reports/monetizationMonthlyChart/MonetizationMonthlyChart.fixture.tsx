/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-console */
import * as React from "react";
import styled from "styled-components";
import {
  MonetizationMonthlyChart,
  Props,
} from "./MonetizationMonthlyChart";
import FixtureDecorator from "../../../../../utils/cosmos/FixtureDecorator";
import { ChartSeriesData } from "../../../../qwiltChart/_domain/chartSeriesData";
import { HistogramPoint } from "../../../../../utils/histograms/domain/histogramPoint";
import { HistogramSeries } from "../../../../../utils/histograms/domain/histogramSeries";
import { darken } from "polished";
import { ColumnChartSeriesOptions } from "highcharts";
import { MonetizationColors } from "../../_utils/monetizationColors";
import { createYearOfMonthlyMockPoints } from "../../_utils/monetizationMockUtils";

const View = styled(FixtureDecorator)`
  margin: 1em;
  padding: 1em;
  position: relative;
  border: 3px dashed lightgrey;
`;
function createMockMonthlyRevenueSeriesData(data: HistogramPoint[], withHoverState: boolean) {
  return new ChartSeriesData({
    id: "cqda",
    name,
    histogram: new HistogramSeries(name, data),
    type: "column",
    stacking: "normal",
    color: MonetizationColors.CQDA_COLOR,
    // important - must define this in when implementing provider to have hover state working
    userOptions: {
      states: {
        hover: {
          color: withHoverState ? darken(0.2, MonetizationColors.CQDA_COLOR) : MonetizationColors.CQDA_COLOR,
        },
      },
    } as ColumnChartSeriesOptions,
  });
}
function getProps(withHoverState = true): Props {
  const cqdaData = createYearOfMonthlyMockPoints();
  return {
    title: "Monthly Charge",
    subTitle: "Last 12 months",
    seriesData: [createMockMonthlyRevenueSeriesData(cqdaData, withHoverState)],
  };
}

export default {
  regular: (
    <View>
      <MonetizationMonthlyChart {...getProps()} />
    </View>
  ),
  "without darkened hover state": (
    <View>
      <MonetizationMonthlyChart {...getProps(false)} />
    </View>
  ),
};
