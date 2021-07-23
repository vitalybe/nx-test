/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-console */
import * as React from "react";
import styled from "styled-components";
import {
  MonetizationPanelHeader,
  Props,
} from "common/components/_projectSpecific/monetization/reports/monetizationPanelHeader/MonetizationPanelHeader";
import FixtureDecorator from "common/utils/cosmos/FixtureDecorator";
import { MonetizationChartLegend } from "../monetizationChartLegend/MonetizationChartLegend";
import { DateTime } from "luxon";

const View = styled(FixtureDecorator)`
  margin: 1em;
  padding: 1em;
  position: relative;
  border: 3px dashed lightgrey;

  width: 1000px;
  height: 500px;
`;

function getProps(): Props {
  return {
    title: "Services Breakdown",
    subTitle: "Last 12 months",
  };
}

export default {
  regular: (
    <View>
      <MonetizationPanelHeader {...getProps()} />
    </View>
  ),
  "with legend": (
    <View>
      <MonetizationPanelHeader {...getProps()}>
        <MonetizationChartLegend
          isLastPoint={true}
          legendItems={[
            {
              value: 70_000,
              label: "CQDA",
              color: "green",
            },
            {
              value: 30_000,
              label: "SP",
              color: "orange",
            },
          ]}
          currentDate={DateTime.local()}
          total={{ value: 100_000, label: "Total", color: "black" }}
        />
      </MonetizationPanelHeader>
    </View>
  ),
};
