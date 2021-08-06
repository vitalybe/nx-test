import * as React from "react";
import styled from "styled-components";
import { BwPeakIcon } from "./icons/bwPeakIcon/BwPeakIcon";
import { DescriptionRow, Metric, Props, Value, ValueRow } from "./Metric";

import FixtureDecorator from "../../utils/cosmos/FixtureDecorator";

const View = styled(FixtureDecorator)`
  margin: 1em;
  padding: 1em;
  position: absolute;
  border: 3px dashed lightgrey;
  background-color: #022e40;
`;

const MetricStyled = styled(Metric)`
  width: 100%;
  height: 100%;
  color: whitesmoke;

  ${Value} {
    font-size: 22px;
  }

  ${DescriptionRow} {
    font-size: 10px;
  }
`;

const MetricCustomStyled = styled(Metric)`
  width: 100%;
  height: 100%;
  color: whitesmoke;

  ${ValueRow} {
    color: lightblue;
  }

  ${DescriptionRow} {
    font-size: 10px;
  }

  ${Value} {
    font-size: 22px;
  }
`;

function getProps(): Props {
  return {
    value: "156",
    units: "Gbps",
    iconComponent: <BwPeakIcon iconTheme={"bright"} />,
    description: "AVG. BW",
  };
}

export default {
  "-Regular": (
    <View>
      <MetricStyled {...getProps()} />
    </View>
  ),
  Percents: (
    <View>
      <MetricStyled {...getProps()} value={"80%"} units={""} />
    </View>
  ),
  "Different colors": (
    <View>
      <MetricCustomStyled {...getProps()} />
    </View>
  ),
  "No icon": (
    <View>
      <MetricStyled {...getProps()} iconComponent={undefined} />
    </View>
  ),
};
