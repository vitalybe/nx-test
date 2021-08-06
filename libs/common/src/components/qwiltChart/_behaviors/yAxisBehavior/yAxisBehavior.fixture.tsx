import * as React from "react";
import styled from "styled-components";
import { ChartSeriesData } from "../../_domain/chartSeriesData";
import { MediaAnalyticsSeries } from "../../../../backend/mediaAnalytics/mediaAnalyticsSeries";

import FixtureDecorator from "../../../../utils/cosmos/FixtureDecorator";

import { TimeConfig } from "../../../../utils/timeConfig";
import { DateTime } from "luxon";
import { QwiltChart } from "../../QwiltChart";
import { ChartBehavior } from "../../_domain/chartBehavior";
import { YAxisBehavior } from "./yAxisBehavior";
import { CommonColors } from "../../../../styling/commonColors";
import { AddSeriesBehavior } from "../addSeriesBehavior/addSeriesBehavior";
import { XAxisBehavior } from "../xAxisBehavior/xAxisBehavior";

const View = styled(FixtureDecorator)`
  margin: 1em;
  width: 80%;
  height: 300px;
  background-color: yellow;
`;

function getBehaviors(): ChartBehavior[] {
  return [new XAxisBehavior({ timezone: DateTime.local().zone }), new AddSeriesBehavior()];
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

export default {
  "-Regular": (
    <View>
      <QwiltChart
        {...getProps(
          new YAxisBehavior({
            gridLineColor: CommonColors.BLACK,
          })
        )}
      />
    </View>
  ),
  Alternative: (
    <View>
      <QwiltChart
        {...getProps(
          new YAxisBehavior({
            gridLineColor: "green",
          })
        )}
      />
    </View>
  ),
};
