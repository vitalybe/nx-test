/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-console */
import * as React from "react";
import styled from "styled-components";
import { Props, QwiltPieChart } from "common/components/qwiltPieChart/QwiltPieChart";
import FixtureDecorator from "common/utils/cosmos/FixtureDecorator";

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
    parts: [
      {
        y: 10,
        color: "green",
        name: "A",
      },
      {
        y: 12,
        color: "orange",
        name: "B",
      },
    ],
  };
}

export default {
  regular: (
    <View>
      <QwiltPieChart {...getProps()} />
    </View>
  ),
};
