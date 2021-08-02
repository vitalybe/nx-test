import * as React from "react";
import styled from "styled-components";
import { Props, RoundImageButton } from "src/_parts/roundImageButton/RoundImageButton";
import { mockUtils } from "common/utils/mockUtils";
import FixtureDecorator from "common/utils/cosmos/FixtureDecorator";

const View = styled(FixtureDecorator)`
  margin: 1em;
  width: 200px;
`;

function getProps(): Props {
  return {
    imagePath: require("src/_images/chart.svg"),
    onClick: mockUtils.mockAction("onClick"),
  };
}

const RoundImageButtonStyled = styled(RoundImageButton)`
  width: 48px;
  height: 48px;
`;

export default {
  Regular: (
    <View>
      <RoundImageButtonStyled {...getProps()} />
    </View>
  ),
};
