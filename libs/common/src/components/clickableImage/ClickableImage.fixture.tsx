import * as React from "react";
import styled from "styled-components";
import { ClickableImage, Props } from "common/components/clickableImage/ClickableImage";

import FixtureDecorator from "common/utils/cosmos/FixtureDecorator";

const View = styled(FixtureDecorator)`
  margin: 1em;
  width: 200px;
`;

function getProps(): Props {
  return {
    imagePath: require("common/images/map.svg"),
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
