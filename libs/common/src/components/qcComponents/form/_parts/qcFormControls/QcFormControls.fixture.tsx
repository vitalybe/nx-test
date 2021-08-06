/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-console */
import * as React from "react";
import styled from "styled-components";
import { Props, QcFormControls } from "./QcFormControls";
import FixtureDecorator from "../../../../../utils/cosmos/FixtureDecorator";

const View = styled(FixtureDecorator)`
  margin: 1em;
  padding: 1em;
  position: relative;
  border: 3px dashed lightgrey;

  width: 1000px;
  height: 500px;
`;

function getProps(): Props {
  return {};
}

export default {
  regular: (
    <View>
      <QcFormControls {...getProps()} />
    </View>
  ),
};
