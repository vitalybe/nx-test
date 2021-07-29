import * as React from "react";
import styled from "styled-components";
import { QwiltChart } from "common/components/qwiltChart/QwiltChart";
import { MediaAnalyticsSeries } from "common/backend/mediaAnalytics/mediaAnalyticsSeries";

import FixtureDecorator from "common/utils/cosmos/FixtureDecorator";

import { ChartBehavior } from "common/components/qwiltChart/_domain/chartBehavior";
import { TimeConfig } from "common/utils/timeConfig";
import { DateTime } from "luxon";
import { ChartSeriesData } from "common/components/qwiltChart/_domain/chartSeriesData";
import { CommonColors } from "common/styling/commonColors";
import { XAxisBehavior } from "common/components/qwiltChart/_behaviors/xAxisBehavior/xAxisBehavior";
import { YAxisBehavior } from "common/components/qwiltChart/_behaviors/yAxisBehavior/yAxisBehavior";
import { AddSeriesBehavior } from "common/components/qwiltChart/_behaviors/addSeriesBehavior/addSeriesBehavior";
import { MarkersOnHoverBehavior } from "common/components/qwiltChart/_behaviors/markersOnHoverBehavior/markersOnHoverBehavior";
import { SeriesPeaksBehavior } from "common/components/qwiltChart/_behaviors/seriesPeaksBehavior/seriesPeaksBehavior";

const View = styled(FixtureDecorator)`
  margin: 1em;
  width: 80%;
  height: 300px;
  background-color: yellow;
`;

function getChartSeriesData() {
  return ChartSeriesData.createArrayMock(
    [MediaAnalyticsSeries.L2_BW_BY_CONTENT_PROVIDER, MediaAnalyticsSeries.L2_BW_DELIVERED],
    TimeConfig.getMockMonthConfiguration()
  );
}

function getBehaviors(): ChartBehavior[] {
  return [
    new XAxisBehavior({
      timezone: DateTime.local().zone,
      backgroundColor: "#eaf9ff",
      gridLineColor: "#f7f7f7",
      labelsColor: "#99a7ac",
    }),
    new YAxisBehavior({ labelsColor: "#99a7ac" }),
    new SeriesPeaksBehavior(),
    new AddSeriesBehavior(),
    new MarkersOnHoverBehavior({ verticalLine: { color: CommonColors.BLACK }, bubbles: true }),
  ];
}

export default {
  "-Regular": (
    <View>
      <QwiltChart behaviors={getBehaviors()} seriesData={getChartSeriesData()} />
    </View>
  ),
};
