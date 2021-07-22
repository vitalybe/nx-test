import * as React from "react";
import styled from "styled-components";
import { ChartSeriesData } from "common/components/qwiltChart/_domain/chartSeriesData";
import { MediaAnalyticsSeries } from "common/backend/mediaAnalytics/mediaAnalyticsSeries";

import FixtureDecorator from "common/utils/cosmos/FixtureDecorator";

import { TimeConfig } from "common/utils/timeConfig";
import { DateTime } from "luxon";
import { QwiltChart } from "common/components/qwiltChart/QwiltChart";
import { YAxisBehavior } from "common/components/qwiltChart/_behaviors/yAxisBehavior/yAxisBehavior";
import { XAxisBehavior } from "common/components/qwiltChart/_behaviors/xAxisBehavior/xAxisBehavior";
import { AddSeriesBehavior } from "common/components/qwiltChart/_behaviors/addSeriesBehavior/addSeriesBehavior";

const View = styled(FixtureDecorator)`
  margin: 1em;
  width: 80%;
  height: 300px;
  background-color: yellow;
`;

function getProps(seriesDataOverrides: Partial<ChartSeriesData>) {
  return {
    behaviors: [
      new XAxisBehavior({ timezone: DateTime.local().zone }),
      new YAxisBehavior({ gridLineColor: "#dedede" }),
      new AddSeriesBehavior(),
    ],
    seriesData: ChartSeriesData.createArrayMock(
      [MediaAnalyticsSeries.L2_BW_BY_CONTENT_PROVIDER, MediaAnalyticsSeries.L2_BW_DELIVERED],
      TimeConfig.getMockMonthConfiguration(),
      seriesDataOverrides
    ),
  };
}

export default {
  "Line chart": (
    <View>
      <QwiltChart
        {...getProps({
          type: "line",
        })}
      />
    </View>
  ),
  "Area chart": (
    <View>
      <QwiltChart
        {...getProps({
          type: "area",
        })}
      />
    </View>
  ),
  "Stacked Area chart": (
    <View>
      <QwiltChart
        {...getProps({
          type: "area",
          stacking: "normal",
        })}
      />
    </View>
  ),
};
