import * as React from "react";
import styled from "styled-components";
import { Props, QwiltConfirm } from "./QwiltConfirm";
import FixtureDecorator from "../../../../utils/cosmos/FixtureDecorator";

const View = styled(FixtureDecorator)`
  margin: 1em;
  padding: 1em;
  position: absolute;
  border: 3px dashed lightgrey;
`;

function getProps(propsOverrides?: Partial<Props>): Props {
  return {
    title: "Confirm Deletion",
    onCancel: () => {},
    onOk: () => {},
    message: "qwdf",

    ...propsOverrides,
  };
}

export default {
  "-Regular": (
    <View>
      <QwiltConfirm {...getProps()} />
    </View>
  ),
};
