import * as React from "react";
import styled from "styled-components";
import { BooleanToggle, Props } from "common/components/booleanToggle/BooleanToggle";
import FixtureDecorator from "common/utils/cosmos/FixtureDecorator";

const View = styled(FixtureDecorator)`
  margin: 1em;
  padding: 1em;
  position: absolute;
  border: 3px dashed lightgrey;
`;

const groupByToggleOptions = {
  label: "group by",
  falseOption: { label: "dsg" },
  trueOption: { label: "isps" },
};

function getProps(): Props {
  return {
    current: false,
    options: groupByToggleOptions,
  };
}

export default {
  "-Regular": (
    <View>
      <BooleanToggle {...getProps()} />
    </View>
  ),
};
