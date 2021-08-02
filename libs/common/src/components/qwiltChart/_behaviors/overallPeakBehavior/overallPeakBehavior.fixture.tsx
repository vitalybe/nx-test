import * as React from "react";
import styled from "styled-components";
import { ChartSeriesData } from "../../_domain/chartSeriesData";
import { MediaAnalyticsSeries } from "../../../../backend/mediaAnalytics/mediaAnalyticsSeries";

import FixtureDecorator from "../../../../utils/cosmos/FixtureDecorator";

import { TimeConfig } from "../../../../utils/timeConfig";
import { DateTime, Duration } from "luxon";
import { QwiltChart } from "../../QwiltChart";
import { ChartBehavior } from "../../_domain/chartBehavior";
import { OverallPeakBehavior } from "./overallPeakBehavior";
import { YAxisBehavior } from "../yAxisBehavior/yAxisBehavior";
import { AddSeriesBehavior } from "../addSeriesBehavior/addSeriesBehavior";
import { XAxisBehavior } from "../xAxisBehavior/xAxisBehavior";
import { MarkersOnHoverBehavior } from "../markersOnHoverBehavior/markersOnHoverBehavior";

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
