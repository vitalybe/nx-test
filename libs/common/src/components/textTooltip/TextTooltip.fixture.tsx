import * as React from "react";
import styled from "styled-components";
import { Props, TextTooltip } from "./TextTooltip";
import FixtureDecorator from "../../utils/cosmos/FixtureDecorator";

const View = styled(FixtureDecorator)`
  margin: 1em;
  padding: 1em;
  position: absolute;
  border: 3px dashed lightgrey;
`;

function getProps(propsOverrides?: Partial<Props>): Props {
  return {
    content: "Hello world",
    children: <div>Hover me</div>,
    ...propsOverrides,
  };
}

export default {
  "-Regular": (
    <View>
      <TextTooltip {...getProps()}>
        <div>Hover me</div>
      </TextTooltip>
    </View>
  ),
};
