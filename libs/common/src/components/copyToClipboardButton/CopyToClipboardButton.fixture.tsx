/* eslint-disable react-hooks/rules-of-hooks */
import * as React from "react";
import styled from "styled-components";
import { CopyToClipboardButton, Props } from "common/components/copyToClipboardButton/CopyToClipboardButton";
import FixtureDecorator from "common/utils/cosmos/FixtureDecorator";

const View = styled(FixtureDecorator)`
  margin: 1em;
  padding: 1em;
  position: relative;
  border: 3px dashed lightgrey;

  width: 1000px;
  height: 500px;
  // without 'grid' the child item won't get the dimensions of the parent
  display: grid;
`;

function getProps(): Props {
  return {
    textToCopy: "",
  };
}

export default {
  regular: (
    <View>
      <CopyToClipboardButton {...getProps()}></CopyToClipboardButton>
    </View>
  ),
};
