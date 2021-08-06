import * as React from "react";
import styled from "styled-components";
import { ChartSeriesData } from "../../_domain/chartSeriesData";
import { MediaAnalyticsSeries } from "../../../../backend/mediaAnalytics/mediaAnalyticsSeries";

import FixtureDecorator from "../../../../utils/cosmos/FixtureDecorator";

import { TimeConfig } from "../../../../utils/timeConfig";
import { DateTime, Duration, FixedOffsetZone } from "luxon";
import { QwiltChart } from "../../QwiltChart";
import { ChartBehavior } from "../../_domain/chartBehavior";
import { XAxisBehavior } from "./xAxisBehavior";
import { YAxisBehavior } from "../yAxisBehavior/yAxisBehavior";
import { AddSeriesBehavior } from "../addSeriesBehavior/addSeriesBehavior";

const View = styled(FixtureDecorator)`
  margin: 1em;
  width: 80%;
  height: 300px;
  background-color: yellow;
`;

function getBehaviors(behavior: ChartBehavior): ChartBehavior[] {
  return [new YAxisBehavior({ gridLineColor: "#dedede" }), new AddSeriesBehavior(), behavior];
}

export default {
  "-1- Hours (1)": () => {
    const behaviors = getBehaviors(new XAxisBehavior({}));
    const chartSeriesData = ChartSeriesData.createArrayMock(
      [MediaAnalyticsSeries.L2_BW_BY_CONTENT_PROVIDER, MediaAnalyticsSeries.L2_BW_DELIVERED],
      TimeConfig.fromDuration(
        Duration.fromObject({
          hour: 1,
        }),
        DateTime.fromISO("2018-10-08T21:00:00.000+03:00")
      )
    );
    return (
      <View>
        <QwiltChart behaviors={behaviors} seriesData={chartSeriesData} />
      </View>
    );
  },
  "-2- Days (1)": () => {
    const behaviors = getBehaviors(new XAxisBehavior({}));
    const chartSeriesData = ChartSeriesData.createArrayMock(
      [MediaAnalyticsSeries.L2_BW_BY_CONTENT_PROVIDER, MediaAnalyticsSeries.L2_BW_DELIVERED],
      TimeConfig.fromDuration(
        Duration.fromObject({
          days: 1,
        }),
        DateTime.fromISO("2018-10-08T21:00:00.000+03:00")
      )
    );
    return (
      <View>
        <QwiltChart behaviors={behaviors} seriesData={chartSeriesData} />
      </View>
    );
  },
  "-2- Days (2)": () => {
    const behaviors = getBehaviors(new XAxisBehavior({}));
    const chartSeriesData = ChartSeriesData.createArrayMock(
      [MediaAnalyticsSeries.L2_BW_BY_CONTENT_PROVIDER, MediaAnalyticsSeries.L2_BW_DELIVERED],
      TimeConfig.fromDuration(
        Duration.fromObject({
          days: 2,
        }),
        DateTime.fromISO("2018-10-08T21:00:00.000+03:00")
      )
    );
    return (
      <View>
        <QwiltChart behaviors={behaviors} seriesData={chartSeriesData} />
      </View>
    );
  },
  "-2- Days (3)": () => {
    const behaviors = getBehaviors(new XAxisBehavior({}));
    const chartSeriesData = ChartSeriesData.createArrayMock(
      [MediaAnalyticsSeries.L2_BW_BY_CONTENT_PROVIDER, MediaAnalyticsSeries.L2_BW_DELIVERED],
      TimeConfig.fromDuration(
        Duration.fromObject({
          days: 3,
        }),
        DateTime.fromISO("2018-10-08T21:00:00.000+03:00")
      )
    );
    return (
      <View>
        <QwiltChart behaviors={behaviors} seriesData={chartSeriesData} />
      </View>
    );
  },
  "-2- Days (7)": () => {
    const behaviors = getBehaviors(new XAxisBehavior({}));
    const chartSeriesData = ChartSeriesData.createArrayMock(
      [MediaAnalyticsSeries.L2_BW_BY_CONTENT_PROVIDER, MediaAnalyticsSeries.L2_BW_DELIVERED],
      TimeConfig.fromDuration(
        Duration.fromObject({
          days: 7,
        }),
        DateTime.fromISO("2018-10-08T21:00:00.000+03:00")
      )
    );
    return (
      <View>
        <QwiltChart behaviors={behaviors} seriesData={chartSeriesData} />
      </View>
    );
  },
  "-2.5- Days (8)": () => {
    const behaviors = getBehaviors(new XAxisBehavior({}));
    const chartSeriesData = ChartSeriesData.createArrayMock(
      [MediaAnalyticsSeries.L2_BW_BY_CONTENT_PROVIDER, MediaAnalyticsSeries.L2_BW_DELIVERED],
      TimeConfig.fromDuration(
        Duration.fromObject({
          days: 8,
        }),
        DateTime.fromISO("2018-10-08T21:00:00.000+03:00")
      )
    );
    return (
      <View>
        <QwiltChart behaviors={behaviors} seriesData={chartSeriesData} />
      </View>
    );
  },
  "-3- Days (30)": () => {
    const behaviors = getBehaviors(new XAxisBehavior({}));
    const chartSeriesData = ChartSeriesData.createArrayMock(
      [MediaAnalyticsSeries.L2_BW_BY_CONTENT_PROVIDER, MediaAnalyticsSeries.L2_BW_DELIVERED],
      TimeConfig.fromDuration(
        Duration.fromObject({
          days: 30,
        }),
        DateTime.fromISO("2018-10-08T21:07:00.000+03:00")
      )
    );
    return (
      <View>
        <QwiltChart behaviors={behaviors} seriesData={chartSeriesData} />
      </View>
    );
  },
  "-3- Days (90)": () => {
    const behaviors = getBehaviors(new XAxisBehavior({}));
    const chartSeriesData = ChartSeriesData.createArrayMock(
      [MediaAnalyticsSeries.L2_BW_BY_CONTENT_PROVIDER, MediaAnalyticsSeries.L2_BW_DELIVERED],
      TimeConfig.fromDuration(
        Duration.fromObject({
          days: 90,
        }),
        DateTime.fromISO("2018-10-08T21:00:00.000+03:00")
      )
    );
    return (
      <View>
        <QwiltChart behaviors={behaviors} seriesData={chartSeriesData} />
      </View>
    );
  },
  "-4- Year (1)": () => {
    const behaviors = getBehaviors(new XAxisBehavior({}));
    const chartSeriesData = ChartSeriesData.createArrayMock(
      [MediaAnalyticsSeries.L2_BW_BY_CONTENT_PROVIDER, MediaAnalyticsSeries.L2_BW_DELIVERED],
      TimeConfig.fromDuration(
        Duration.fromObject({
          year: 1,
        }),
        DateTime.fromISO("2018-10-08T21:00:00.000+03:00")
      )
    );
    return (
      <View>
        <QwiltChart behaviors={behaviors} seriesData={chartSeriesData} />
      </View>
    );
  },
  "-5- Year (2)": () => {
    const behaviors = getBehaviors(new XAxisBehavior({}));
    const chartSeriesData = ChartSeriesData.createArrayMock(
      [MediaAnalyticsSeries.L2_BW_BY_CONTENT_PROVIDER, MediaAnalyticsSeries.L2_BW_DELIVERED],
      TimeConfig.fromDuration(
        Duration.fromObject({
          year: 2,
        }),
        DateTime.fromISO("2018-10-08T21:00:00.000+03:00")
      )
    );
    return (
      <View>
        <QwiltChart behaviors={behaviors} seriesData={chartSeriesData} />
      </View>
    );
  },
  "Timezone - UTC+6": () => {
    const behaviors = getBehaviors(
      new XAxisBehavior({
        timezone: FixedOffsetZone.parseSpecifier("UTC+6"),
      })
    );
    const chartSeriesData = ChartSeriesData.createArrayMock(
      [MediaAnalyticsSeries.L2_BW_BY_CONTENT_PROVIDER, MediaAnalyticsSeries.L2_BW_DELIVERED],
      TimeConfig.fromDuration(
        Duration.fromObject({
          days: 1,
        }),
        DateTime.fromISO("2018-10-08T21:00:00.000+03:00")
      )
    );
    return (
      <View>
        <QwiltChart behaviors={behaviors} seriesData={chartSeriesData} />
      </View>
    );
  },
  "Timezone - Local time zone": () => {
    const behaviors = getBehaviors(new XAxisBehavior({}));
    const chartSeriesData = ChartSeriesData.createArrayMock(
      [MediaAnalyticsSeries.L2_BW_BY_CONTENT_PROVIDER, MediaAnalyticsSeries.L2_BW_DELIVERED],
      TimeConfig.fromDuration(
        Duration.fromObject({
          days: 1,
        }),
        DateTime.fromISO("2018-10-08T21:00:00.000+03:00")
      )
    );
    return (
      <View>
        <QwiltChart behaviors={behaviors} seriesData={chartSeriesData} />
      </View>
    );
  },
  "Background color": () => {
    const behaviors = getBehaviors(
      new XAxisBehavior({
        backgroundColor: "#eaf9ff",
      })
    );
    const chartSeriesData = ChartSeriesData.createArrayMock(
      [MediaAnalyticsSeries.L2_BW_BY_CONTENT_PROVIDER, MediaAnalyticsSeries.L2_BW_DELIVERED],
      TimeConfig.fromDuration(
        Duration.fromObject({
          days: 1,
        }),
        DateTime.fromISO("2018-10-08T21:00:00.000+03:00")
      )
    );
    return (
      <View>
        <QwiltChart behaviors={behaviors} seriesData={chartSeriesData} />
      </View>
    );
  },
};
