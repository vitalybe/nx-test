/* eslint-disable react-hooks/rules-of-hooks */
import * as React from "react";
import styled from "styled-components";
import { Props, WduSummary } from "./WduSummary";
import FixtureDecorator from "@qwilt/common/utils/cosmos/FixtureDecorator";

const View = styled(FixtureDecorator)`
  margin: 1em;
  padding: 1em;
  position: relative;
  border: 3px dashed lightgrey;

  width: 1000px;
  height: 500px;
`;

function getProps(): Props {
  return {
    isSystemUpdateCreated: false,
    onClose: () => {},
    onFinish: () => {},
  };
}

export default {
  regular: (
    <View>
      <WduSummary {...getProps()}></WduSummary>
    </View>
  ),
};
