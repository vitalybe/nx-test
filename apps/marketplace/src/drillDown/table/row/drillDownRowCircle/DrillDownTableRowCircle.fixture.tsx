import * as React from "react";
import styled from "styled-components";
import { DrillDownTableRowCircle, Props } from "src/drillDown/table/row/drillDownRowCircle/DrillDownTableRowCircle";
import { mockUtils } from "common/utils/mockUtils";

const View = styled(FixtureDecorator)`
  margin: 1em;
  width: 200px;
`;

import FixtureDecorator from "common/utils/cosmos/FixtureDecorator";

function getProps(): Props {
  return {
    color: "pink",
    isEnabled: false,
    onClick: mockUtils.mockAction("onClick"),
  };
}

export default {
  Regular: (
    <View>
      <DrillDownTableRowCircle {...getProps()} />
    </View>
  ),
  Disabled: (
    <View>
      <DrillDownTableRowCircle {...getProps()} isEnabled={true} />
    </View>
  ),
};
