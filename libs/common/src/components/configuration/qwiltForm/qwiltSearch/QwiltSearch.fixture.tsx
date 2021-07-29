import * as React from "react";
import styled from "styled-components";
import { Props, QwiltInput } from "../qwiltInput/QwiltInput";
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
    value: "My value",
    onChange: () => {},
    ...propsOverrides,
  };
}

export default {
  "-Regular": (
    <View>
      <QwiltInput {...getProps()} />
    </View>
  ),
  Clearable: (
    <View>
      <QwiltInput {...getProps()} clearable={true} />
    </View>
  ),
  Empty: (
    <View>
      <QwiltInput {...getProps()} value={""} />
    </View>
  ),
};
