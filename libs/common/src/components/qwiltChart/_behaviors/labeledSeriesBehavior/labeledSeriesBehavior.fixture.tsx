import * as React from "react";
import styled from "styled-components";
import { ChartSeriesData } from "common/components/qwiltChart/_domain/chartSeriesData";
import { MediaAnalyticsSeries } from "common/backend/mediaAnalytics/mediaAnalyticsSeries";

import FixtureDecorator from "common/utils/cosmos/FixtureDecorator";

import { TimeConfig } from "common/utils/timeConfig";
import { DateTime } from "luxon";
import { QwiltChart } from "common/components/qwiltChart/QwiltChart";
import { ChartBehavior } from "common/components/qwiltChart/_domain/chartBehavior";
import { LabeledSeriesBehavior } from "common/components/qwiltChart/_behaviors/labeledSeriesBehavior/labeledSeriesBehavior";
import { YAxisBehavior } from "common/components/qwiltChart/_behaviors/yAxisBehavior/yAxisBehavior";
import { AddSeriesBehavior } from "common/components/qwiltChart/_behaviors/addSeriesBehavior/addSeriesBehavior";
import { XAxisBehavior } from "common/components/qwiltChart/_behaviors/xAxisBehavior/xAxisBehavior";
import { HistogramSeries } from "common/utils/histograms/domain/histogramSeries";

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
