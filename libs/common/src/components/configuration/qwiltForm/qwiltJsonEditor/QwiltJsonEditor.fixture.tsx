import * as React from "react";
import styled from "styled-components";
import { Props, QwiltJsonEditor } from "common/components/configuration/qwiltForm/qwiltJsonEditor/QwiltJsonEditor";

import FixtureDecorator from "common/utils/cosmos/FixtureDecorator";

const View = styled(FixtureDecorator)`
  margin: 1em;
  padding: 1em;
  position: absolute;
  border: 3px dashed lightgrey;
  width: 500px;
`;

const QwiltJsonEditorStyled = styled(QwiltJsonEditor)`
  width: 100%;
  height: 100%;
`;

function getProps(): Props {
  return {
    canMinimize: true,
    minimized: false,
    value: {
      a: 1,
      b: "story",
      c: {
        d: true,
        e: null,
      },
    },
  };
}

export default {
  "-Regular": (
    <View>
      <QwiltJsonEditorStyled {...getProps()} />
    </View>
  ),
  "Errors bar": () => {
    return <QwiltJsonEditorStyled {...getProps()} initialMode={"text"} showErrors={true} />;
  },
};
