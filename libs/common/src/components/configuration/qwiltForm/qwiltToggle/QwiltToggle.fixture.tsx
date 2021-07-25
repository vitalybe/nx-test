import * as React from "react";
import styled from "styled-components";
import { Props, QwiltToggle } from "./QwiltToggle";
import FixtureDecorator from "../../../../utils/cosmos/FixtureDecorator";

const View = styled(FixtureDecorator)`
  margin: 1em;
  padding: 1em;
  position: absolute;
  border: 3px dashed lightgrey;
`;

function getProps(propsOverrides?: Partial<Props>): Props {
  return {
    label: "My label",
    checked: true,
    onChange: () => {},
    ...propsOverrides,
  };
}

export default {
  "-Regular": (
    <View>
      <QwiltToggle {...getProps()} />
    </View>
  ),
};
