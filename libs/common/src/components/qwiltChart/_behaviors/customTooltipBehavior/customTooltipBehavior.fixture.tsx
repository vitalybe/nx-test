import * as React from "react";
import styled from "styled-components";
import { ChartSeriesData } from "common/components/qwiltChart/_domain/chartSeriesData";
import { MediaAnalyticsSeries } from "common/backend/mediaAnalytics/mediaAnalyticsSeries";

import FixtureDecorator from "common/utils/cosmos/FixtureDecorator";

import { TimeConfig } from "common/utils/timeConfig";
import { DateTime } from "luxon";
import { QwiltChart } from "common/components/qwiltChart/QwiltChart";
import { ChartBehavior } from "common/components/qwiltChart/_domain/chartBehavior";
import { CustomTooltipBehavior } from "common/components/qwiltChart/_behaviors/customTooltipBehavior/customTooltipBehavior";
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

function getProps(additionalBehavior: ChartBehavior) {
  const behaviors = getBehaviors();
  return {
    behaviors: [...behaviors, additionalBehavior],
    seriesData: getChartSeriesData([
      MediaAnalyticsSeries.L2_BW_BY_CONTENT_PROVIDER,
      MediaAnalyticsSeries.L2_BW_DELIVERED,
    ]),
  };
}

const StoryTooltip = (props: { index: number; chartSeriesDataItems: ChartSeriesData[] }) => {
  if (props.chartSeriesDataItems.length === 0 || props.chartSeriesDataItems[0].histogram.points.length === 0) {
    return null;
  }

  const x = props.chartSeriesDataItems[0].histogram.points[props.index].x;
  return (
    <div>
      <div>Index: {props.index}</div>
      <div>X: {DateTime.fromMillis(x).toFormat("D T")}</div>
      {props.chartSeriesDataItems.map((chartSeriesData) => (
        <div key={chartSeriesData.name}>
          <div>
            Series: {chartSeriesData.name} - {chartSeriesData.histogram.points[props.index].y}
          </div>
        </div>
      ))}
    </div>
  );
};

export default {
  "-Regular": (
    <View>
      <QwiltChart {...getProps(new CustomTooltipBehavior(StoryTooltip))} />
    </View>
  ),
};
