/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-console */
import * as React from "react";
import styled from "styled-components";
import { OverallRevenueChart, Props } from "./OverallRevenueChart";
import FixtureDecorator from "common/utils/cosmos/FixtureDecorator";
import { ChartSeriesData } from "common/components/qwiltChart/_domain/chartSeriesData";
import { DateTime } from "luxon";
import { HistogramSeries } from "common/utils/histograms/domain/histogramSeries";
import { HistogramPoint } from "common/utils/histograms/domain/histogramPoint";
import { createYearsOfMockProjectData } from "common/components/_projectSpecific/monetization/_utils/monetizationMockUtils";
import { MonetizationProjectEntity } from "common/components/_projectSpecific/monetization/_domain/monetizationProjectEntity";

const View = styled(FixtureDecorator)`
  margin: 1em;
  padding: 1em;
  position: relative;
  border: 3px dashed lightgrey;

  width: 95%;
  height: 31.25rem;
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
    seriesData: [createSeriesData("CQDA", cqdaRevenuePoints[0]), createSeriesData("SP", ispRevenuePoints[0])],
    selectedProjects: [
      MonetizationProjectEntity.createMock({
        financingPhaseData: {
          endDate: undefined,
          expectedEndDate: DateTime.fromObject({ year: 2021, month: 11 }),
          threshold: 2_200_000,
        },
      }),
    ],
  };
}

export default {
  regular: (
    <View>
      <OverallRevenueChart {...getProps()} />
    </View>
  ),
  "revenue phase": (
    <View>
      <OverallRevenueChart
        {...getProps()}
        selectedProjects={[
          MonetizationProjectEntity.createMock({
            financingPhaseData: {
              endDate: DateTime.fromObject({ year: 2021, month: 12 }),
              expectedEndDate: DateTime.fromObject({ year: 2021, month: 11 }),
              threshold: 2_200_000,
            },
          }),
        ]}
        seriesData={[
          createSeriesData(
            "CQDA",
            cqdaRevenuePoints.slice(0, 3).flatMap((a) => a)
          ),
          createSeriesData(
            "SP",
            ispRevenuePoints.slice(0, 3).flatMap((a) => a)
          ),
        ]}
      />
    </View>
  ),
};
