/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-console */
import * as React from "react";
import styled from "styled-components";
import { ErrorWithTooltip, Props } from "./ErrorWithTooltip";
import { SelectedCdnFixtureDecorator } from "../../../_utils/SelectedCdnFixtureDecorator";

const View = styled(SelectedCdnFixtureDecorator)`
  margin: 1em;
  padding: 1em;
  position: relative;
  border: 3px dashed lightgrey;

  width: 1000px;
  height: 500px;
`;

function getProps(): Props {
  return {
    errorsContent: [<div key={"1"}>Hello</div>, <div key={"2"}>Goodbye</div>],
  };
}

export default {
  regular: (
    <View>
      <ErrorWithTooltip {...getProps()}></ErrorWithTooltip>
    </View>
  ),
};
