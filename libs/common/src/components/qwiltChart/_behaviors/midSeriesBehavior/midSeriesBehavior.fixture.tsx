import * as React from "react";
import styled from "styled-components";
import { ChartSeriesData } from "../../_domain/chartSeriesData";
import { MediaAnalyticsSeries } from "../../../../backend/mediaAnalytics/mediaAnalyticsSeries";

import FixtureDecorator from "../../../../utils/cosmos/FixtureDecorator";

import { TimeConfig } from "../../../../utils/timeConfig";
import { QwiltChart } from "../../QwiltChart";
import { ChartBehavior } from "../../_domain/chartBehavior";
import { MidSeriesBehavior } from "./midSeriesBehavior";
import { YAxisBehavior } from "../yAxisBehavior/yAxisBehavior";
import { AddSeriesBehavior } from "../addSeriesBehavior/addSeriesBehavior";
import { XAxisBehavior } from "../xAxisBehavior/xAxisBehavior";
import { HistogramSeries } from "../../../../utils/histograms/domain/histogramSeries";

const View = styled(FixtureDecorator)`
  margin: 1em;
  width: 80%;
  height: 300px;
  background-color: yellow;
`;

function getProps(behavior: ChartBehavior, seriesDataOverrides: Partial<ChartSeriesData>) {
  const seriesData = ChartSeriesData.createArrayMock(
    [MediaAnalyticsSeries.L2_BW_BY_CONTENT_PROVIDER, MediaAnalyticsSeries.L2_BW_DELIVERED],
    TimeConfig.getMockMonthConfiguration(),
    seriesDataOverrides
  );

  seriesData[0].midSeries = [
    new ChartSeriesData({
      name: "midSeries",
      histogram: HistogramSeries.fromMultipleSeries([seriesData[0].histogram], ([point]) => (point.y ?? 0) / 2),
      // undefined will use the default parent's color darkened color
      color: undefined,
    }),
  ];
  seriesData[1].midSeries = [
    new ChartSeriesData({
      name: "midSeries",
      histogram: HistogramSeries.fromMultipleSeries([seriesData[1].histogram], ([point]) => (point.y ?? 0) / 5),
      color: undefined,
    }),
    new ChartSeriesData({
      name: "midSeries2",
      histogram: HistogramSeries.fromMultipleSeries([seriesData[1].histogram], ([point]) => (point.y ?? 0) / 3),
      color: undefined,
    }),
  ];

  return {
    behaviors: [
      new XAxisBehavior(),
      new YAxisBehavior({ gridLineColor: "#dedede" }),
      new AddSeriesBehavior(),
      behavior,
    ],
    seriesData: seriesData,
  };
}

export default {
  "Stacked area": (
    <View>
      <QwiltChart
        {...getProps(new MidSeriesBehavior(), {
          type: "area",
          stacking: "normal",
        })}
      />
    </View>
  ),
  "Non-stacked line": (
    <View>
      <QwiltChart
        {...getProps(new MidSeriesBehavior(), {
          type: "line",
        })}
      />
    </View>
  ),
};
