/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-console */
import * as React from "react";
import styled from "styled-components";
import {
  MonetizationMetrics,
  Props,
} from "common/components/_projectSpecific/monetization/reports/monetizationMetrics/MonetizationMetrics";
import FixtureDecorator from "common/utils/cosmos/FixtureDecorator";
import { UnitKindEnum, unitsFormatter } from "common/utils/unitsFormatter";

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
    financialMetrics: [
      {
        description: "SP Revenue",
        value: unitsFormatter.format(524_340.5, UnitKindEnum.COUNT),
      },
      {
        showCheck: true,
        checkTooltip: "Payment Received on Feb 21st 2020",
        description: "Total Revenue",
        value: unitsFormatter.format(1_224_879.5, UnitKindEnum.COUNT),
      },
    ],
    trafficMetrics: [
      {
        description: "Peak Delivery",
        value: unitsFormatter.format(325_544_222_212.514, UnitKindEnum.TRAFFIC),
      },
      {
        description: "Peak Bandwidth",
        value: unitsFormatter.format(325_544_222_212.514, UnitKindEnum.TRAFFIC),
      },
      {
        description: "Monthly Volume",
        value: unitsFormatter.format(120_522_487_770_112.514, UnitKindEnum.VOLUME),
      },
    ],
  };
}

export default {
  regular: (
    <View>
      <MonetizationMetrics {...getProps()} />
    </View>
  ),
};
