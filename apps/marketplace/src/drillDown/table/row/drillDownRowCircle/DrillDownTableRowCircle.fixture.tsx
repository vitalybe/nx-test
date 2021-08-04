import * as React from "react";
import styled from "styled-components";
import { DrillDownTableRowCircle, Props } from "src/drillDown/table/row/drillDownRowCircle/DrillDownTableRowCircle";
import { mockUtils } from "common/utils/mockUtils";

import FixtureDecorator from "@qwilt/common/utils/cosmos/FixtureDecorator";

const View = styled(FixtureDecorator)`
  margin: 1em;
  width: 200px;
`;

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
