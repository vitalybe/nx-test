import * as React from "react";
import styled from "styled-components";
import { ChartSeriesData } from "../../_domain/chartSeriesData";
import { MediaAnalyticsSeries } from "../../../../backend/mediaAnalytics/mediaAnalyticsSeries";

import FixtureDecorator from "../../../../utils/cosmos/FixtureDecorator";

import { TimeConfig } from "../../../../utils/timeConfig";
import { DateTime } from "luxon";
import { QwiltChart } from "../../QwiltChart";
import { YAxisBehavior } from "../yAxisBehavior/yAxisBehavior";
import { XAxisBehavior } from "../xAxisBehavior/xAxisBehavior";
import { AddSeriesBehavior } from "./addSeriesBehavior";

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
