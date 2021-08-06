import * as React from "react";
import styled from "styled-components";
import { Props, SelectionBar } from "./SelectionBar";
import { SelectionBarModel } from "./selectionBarModel";
import { SelectionBarCardModel } from "./selectionCard/selectionBarCardModel";

import FixtureDecorator from "@qwilt/common/utils/cosmos/FixtureDecorator";

import * as _ from "lodash";

const View = styled(FixtureDecorator)`
  padding: 2em;
  width: 80%;
  border: 3px dashed lightgrey;
  overflow-x: scroll;
`;

function getProps(selectedCount: number): Props {
  return {
    model: SelectionBarModel.createMock({
      selectionCards: _.range(selectedCount).map((i) => SelectionBarCardModel.createMock(i)),
    }),
  };
}

export default {
  Regular: (
    <View>
      <SelectionBar {...getProps(5)} />)
    </View>
  ),
  Many: (
    <View>
      <SelectionBar {...getProps(15)} />)
    </View>
  ),
  One: (
    <View>
      <SelectionBar {...getProps(1)} />)
    </View>
  ),
};
