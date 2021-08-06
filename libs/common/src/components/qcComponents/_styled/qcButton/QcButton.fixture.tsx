/* eslint-disable react-hooks/rules-of-hooks */
import * as React from "react";
import styled from "styled-components";
import { QcButton, Props } from "./QcButton";
import FixtureDecorator from "../../../../utils/cosmos/FixtureDecorator";
import { QcButtonThemes } from "./_themes";

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
      <QcButton {...getProps()}>Press me</QcButton>
    </View>
  ),
  highlighted: (
    <View>
      <QcButton {...getProps()} isHighlighted>
        Press me
      </QcButton>
    </View>
  ),
  "themed buttons": (
    <View>
      <QcButton {...getProps()} theme={QcButtonThemes.dialogDanger}>
        Press me - I'm regular
      </QcButton>
      <QcButton {...getProps()} isHighlighted theme={QcButtonThemes.dialogDanger}>
        Press me - I'm highlighted
      </QcButton>
    </View>
  ),
};
