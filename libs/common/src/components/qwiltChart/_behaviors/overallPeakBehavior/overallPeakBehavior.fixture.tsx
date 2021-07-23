import * as React from "react";
import styled from "styled-components";
import { ChartSeriesData } from "common/components/qwiltChart/_domain/chartSeriesData";
import { MediaAnalyticsSeries } from "common/backend/mediaAnalytics/mediaAnalyticsSeries";

import FixtureDecorator from "common/utils/cosmos/FixtureDecorator";

import { TimeConfig } from "common/utils/timeConfig";
import { DateTime, Duration } from "luxon";
import { QwiltChart } from "common/components/qwiltChart/QwiltChart";
import { ChartBehavior } from "common/components/qwiltChart/_domain/chartBehavior";
import { OverallPeakBehavior } from "common/components/qwiltChart/_behaviors/overallPeakBehavior/overallPeakBehavior";
import { YAxisBehavior } from "common/components/qwiltChart/_behaviors/yAxisBehavior/yAxisBehavior";
import { AddSeriesBehavior } from "common/components/qwiltChart/_behaviors/addSeriesBehavior/addSeriesBehavior";
import { XAxisBehavior } from "common/components/qwiltChart/_behaviors/xAxisBehavior/xAxisBehavior";
import { MarkersOnHoverBehavior } from "common/components/qwiltChart/_behaviors/markersOnHoverBehavior/markersOnHoverBehavior";

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
    new MarkersOnHoverBehavior({ verticalLine: { color: "blue" } }),
  ];
}

function getChartSeriesData(analyticsSeries: MediaAnalyticsSeries[]) {
  return ChartSeriesData.createArrayMock(analyticsSeries, {
    ...TimeConfig.getMockDayConfiguration(),
    binInterval: Duration.fromObject({ minute: 10 }),
  });
}

export default {
  "-Regular": () => {
    const behaviors = getBehaviors();
    return (
      <View>
        <QwiltChart
          behaviors={[...behaviors, new OverallPeakBehavior()]}
          seriesData={getChartSeriesData([
            MediaAnalyticsSeries.L2_BW_BY_CONTENT_PROVIDER,
            MediaAnalyticsSeries.L2_BW_DELIVERED,
          ])}
        />
      </View>
    );
  },
};
