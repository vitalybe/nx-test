import * as React from "react";
import styled from "styled-components";
import { ChartSeriesData } from "common/components/qwiltChart/_domain/chartSeriesData";
import { MediaAnalyticsSeries } from "common/backend/mediaAnalytics/mediaAnalyticsSeries";

import FixtureDecorator from "common/utils/cosmos/FixtureDecorator";

import { TimeConfig } from "common/utils/timeConfig";
import { DateTime } from "luxon";
import { QwiltChart } from "common/components/qwiltChart/QwiltChart";
import { ChartBehavior } from "common/components/qwiltChart/_domain/chartBehavior";
import { SeriesPeaksBehavior } from "common/components/qwiltChart/_behaviors/seriesPeaksBehavior/seriesPeaksBehavior";
import { YAxisBehavior } from "common/components/qwiltChart/_behaviors/yAxisBehavior/yAxisBehavior";
import { AddSeriesBehavior } from "common/components/qwiltChart/_behaviors/addSeriesBehavior/addSeriesBehavior";
import { XAxisBehavior } from "common/components/qwiltChart/_behaviors/xAxisBehavior/xAxisBehavior";

const View = styled(FixtureDecorator)`
  margin: 1em;
  width: 80%;
  height: 300px;
  background-color: yellow;
`;

function getBehaviors(): ChartBehavior[] {
  return [
    new XAxisBehavior({ timezone: DateTime.local().zone }),
    new YAxisBehavior({ gridLineColor: "#dedede" }),
    new AddSeriesBehavior(),
  ];
}

function getChartSeriesData(analyticsSeries: MediaAnalyticsSeries[]) {
  return ChartSeriesData.createArrayMock(analyticsSeries, TimeConfig.getMockMonthConfiguration());
}

export default {
  "-Regular": () => {
    const behaviors = getBehaviors();
    return (
      <QwiltChart
        behaviors={[...behaviors, new SeriesPeaksBehavior()]}
        seriesData={getChartSeriesData([
          MediaAnalyticsSeries.L2_BW_BY_CONTENT_PROVIDER,
          MediaAnalyticsSeries.L2_BW_DELIVERED,
        ])}
      />
    );
  },
  "Hide peak on series": () => {
    const chartSeriesData = getChartSeriesData([
      MediaAnalyticsSeries.L2_BW_BY_CONTENT_PROVIDER,
      MediaAnalyticsSeries.L2_BW_DELIVERED,
    ]);
    const behaviors = getBehaviors();
    const seriesWithoutPeak = [MediaAnalyticsSeries.L2_BW_DELIVERED.name];
    return (
      <QwiltChart
        behaviors={[
          ...behaviors,
          new SeriesPeaksBehavior({
            filterCallback: (series) => seriesWithoutPeak.includes(series.name),
          }),
        ]}
        seriesData={chartSeriesData}
      />
    );
  },
  "Left edge": () => {
    const chartSeriesData = getChartSeriesData([
      MediaAnalyticsSeries.L2_BW_BY_CONTENT_PROVIDER,
      MediaAnalyticsSeries.L2_BW_DELIVERED,
    ]);
    const histogramPoints = chartSeriesData[0].histogram.points;
    histogramPoints[0].y = 10000000;
    const behaviors = getBehaviors();
    return (
      <View>
        <QwiltChart behaviors={[...behaviors, new SeriesPeaksBehavior()]} seriesData={chartSeriesData} />
      </View>
    );
  },
  "Right edge": () => {
    const chartSeriesData = getChartSeriesData([
      MediaAnalyticsSeries.L2_BW_BY_CONTENT_PROVIDER,
      MediaAnalyticsSeries.L2_BW_DELIVERED,
    ]);
    const histogramPoints = chartSeriesData[0].histogram.points;
    histogramPoints[histogramPoints.length - 1].y = 10000000;
    const behaviors = getBehaviors();
    return (
      <View>
        <QwiltChart behaviors={[...behaviors, new SeriesPeaksBehavior()]} seriesData={chartSeriesData} />
      </View>
    );
  },
};
