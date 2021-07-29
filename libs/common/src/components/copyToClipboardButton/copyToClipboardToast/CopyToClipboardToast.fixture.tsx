import * as React from "react";

import styled from "styled-components";
import { CopyToClipboardToast } from "common/components/copyToClipboardButton/copyToClipboardToast/CopyToClipboardToast";
import FixtureDecorator from "common/utils/cosmos/FixtureDecorator";

const View = styled(FixtureDecorator)`
  margin: 1em;
  padding: 1em;
  position: absolute;
  border: 3px dashed lightgrey;
`;

const CopyToClipboardToastStyled = styled(CopyToClipboardToast)`
  width: 100%;
  height: 100%;
`;

export default {
  "-Regular": (
    <View>
      <CopyToClipboardToastStyled />
    </View>
  ),
};
