/* eslint-disable react-hooks/rules-of-hooks */
import * as React from "react";
import styled from "styled-components";
import {
  DistributionUtilizationBar,
  Props,
} from "./DistributionUtilizationBar";
import FixtureDecorator from "../../../../utils/cosmos/FixtureDecorator";
import { UnitKindEnum } from "../../../../utils/unitsFormatter";
import { CommonColors } from "../../../../styling/commonColors";

const View = styled(FixtureDecorator)`
  margin: 1em;
  padding: 1em;
  position: relative;
  border: 3px dashed lightgrey;

  width: 300px;
  // without 'grid' the child item won't get the dimensions of the parent
  display: grid;
`;

function getProps(): Props {
  return {
    value: 500,
    label: "reserved",
    threshold: { value: 750, label: "configured" },
    unit: UnitKindEnum.VOLUME,
    color: CommonColors.DODGER_BLUE,
    total: 500,
  };
}

export default {
  regular: (
    <View>
      <DistributionUtilizationBar {...getProps()} />
    </View>
  ),
};
