import * as React from "react";
import styled from "styled-components";
import { Props, QwiltFormGroup } from "./QwiltFormGroup";

import FixtureDecorator from "../../../../utils/cosmos/FixtureDecorator";
import { CommonColors } from "../../../../styling/commonColors";

const View = styled(FixtureDecorator)`
  margin: 1em;
  width: 400px;
  background-color: ${CommonColors.MYSTIC_2};
  padding: 3em;
`;

function getProps(propsOverrides?: Partial<Props>): Props {
  return {
    label: "Awesome group",
    ...propsOverrides,
  };
}

export default {
  Regular: (
    <View>
      <QwiltFormGroup {...getProps()}>Group content</QwiltFormGroup>
    </View>
  ),
};
