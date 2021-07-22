/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-console */
import * as React from "react";
import styled from "styled-components";
import { OverallRevenueChartPrint, Props } from "./OverallRevenueChartPrint";
import FixtureDecorator from "common/utils/cosmos/FixtureDecorator";
import { MonetizationProjectEntity } from "common/components/_projectSpecific/monetization/_domain/monetizationProjectEntity";
import { HistogramPoint } from "common/utils/histograms/domain/histogramPoint";
import { ChartSeriesData } from "common/components/qwiltChart/_domain/chartSeriesData";
import { HistogramSeries } from "common/utils/histograms/domain/histogramSeries";
import { createYearsOfMockProjectData } from "common/components/_projectSpecific/monetization/_utils/monetizationMockUtils";

const View = styled(FixtureDecorator)`
  margin: 1em;
  padding: 1em;
  position: relative;
  border: 3px dashed lightgrey;

  width: 1000px;
  height: 500px;
`;

function createSeriesData(name: "CQDA" | "SP", data: HistogramPoint[]) {
  return ChartSeriesData.createMock({
    name: name,
    histogram: new HistogramSeries(name, data),
    type: "area",
    stacking: "normal",
    color: name === "CQDA" ? "#4c7dc4" : "#55e3b4",
  });
}

const cqdaRevenuePoints = createYearsOfMockProjectData();
const ispRevenuePoints = cqdaRevenuePoints.map((points) =>
  points.map((point) => ({ ...point, y: point.y ? point.y / 4 : 0 }))
);

function getProps(): Props {
  return {
    isps: [{ id: "british-telecom", name: "British Telecom " }],
    projects: [MonetizationProjectEntity.createMock()],
    seriesData: [createSeriesData("CQDA", cqdaRevenuePoints[0]), createSeriesData("SP", ispRevenuePoints[0])],
  };
}

export default {
  regular: (
    <View>
      <OverallRevenueChartPrint {...getProps()} />
    </View>
  ),
};
