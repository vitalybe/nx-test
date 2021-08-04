import * as React from "react";
import styled from "styled-components";
import { Props, RoundImageButton } from "./RoundImageButton";
import { mockUtils } from "@qwilt/common/utils/mockUtils";
import FixtureDecorator from "@qwilt/common/utils/cosmos/FixtureDecorator";

const View = styled(FixtureDecorator)`
  margin: 1em;
  width: 200px;
`;

function getProps(): Props {
  return {
    imagePath: require("../../_images/chart.svg"),
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
