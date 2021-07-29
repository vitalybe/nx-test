import * as React from "react";
import styled from "styled-components";
import { ClickableImage, Props } from "./ClickableImage";

import FixtureDecorator from "../../utils/cosmos/FixtureDecorator";

const View = styled(FixtureDecorator)`
  margin: 1em;
  width: 200px;
`;

function getProps(): Props {
  return {
    imagePath: require("../../images/map.svg"),
    onClick: () => {},
  };
}

export default {
  Regular: (
    <View>
      <ClickableImage {...getProps()} height={"128px"} />
    </View>
  ),
};
