import * as React from "react";
import styled from "styled-components";
import { ChartSeriesData } from "../../_domain/chartSeriesData";
import { MediaAnalyticsSeries } from "../../../../backend/mediaAnalytics/mediaAnalyticsSeries";

import FixtureDecorator from "../../../../utils/cosmos/FixtureDecorator";

import { TimeConfig } from "../../../../utils/timeConfig";
import { DateTime } from "luxon";
import { QwiltChart } from "../../QwiltChart";
import { ChartBehavior } from "../../_domain/chartBehavior";
import { LabeledSeriesBehavior } from "./labeledSeriesBehavior";
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

function getBehaviors(): ChartBehavior[] {
  return [
    new XAxisBehavior({ timezone: DateTime.local().zone }),
    new YAxisBehavior({ gridLineColor: "#dedede" }),
    new AddSeriesBehavior(),
  ];
}

export default {
  "-Regular": () => {
    const timeConfig = TimeConfig.getMockMonthConfiguration();
    const serieWithFloatingLabel = "Liney";
    const lineSeries = new ChartSeriesData({
      color: "black",
      name: serieWithFloatingLabel,
      histogram: HistogramSeries.createMock(serieWithFloatingLabel, timeConfig),
    });
    lineSeries.type = "line";
    const chartSeriesData = [
      ...ChartSeriesData.createArrayMock(
        [MediaAnalyticsSeries.L2_BW_BY_CONTENT_PROVIDER, MediaAnalyticsSeries.L2_BW_DELIVERED],
        timeConfig
      ),
      lineSeries,
    ];
    const behaviors = [...getBehaviors(), new LabeledSeriesBehavior([serieWithFloatingLabel])];
    return (
      <View>
        <QwiltChart behaviors={behaviors} seriesData={chartSeriesData} />
      </View>
    );
  },
};
