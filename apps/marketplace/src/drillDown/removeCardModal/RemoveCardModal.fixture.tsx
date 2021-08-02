import * as React from "react";
import styled from "styled-components";
import { RemoveCardModal, Props } from "src/drillDown/removeCardModal/RemoveCardModal";

const View = styled(FixtureDecorator)`
  margin: 1em;
  padding: 1em;
  position: absolute;
  border: 3px dashed lightgrey;
`;

import FixtureDecorator from "common/utils/cosmos/FixtureDecorator";

function getProps(propsOverrides?: Partial<Props>): Props {
  return {
    onUndo: () => {},
    itemName: "wefwef",
    ...propsOverrides,
  };
}

export default {
  "-Regular": (
    <View>
      <RemoveCardModal {...getProps()} />
    </View>
  ),
};
