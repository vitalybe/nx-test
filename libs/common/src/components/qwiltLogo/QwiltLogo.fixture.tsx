import * as React from "react";
import styled from "styled-components";
import { Props, QwiltLogo } from "./QwiltLogo";
import FixtureDecorator from "../../utils/cosmos/FixtureDecorator";

const View = styled(FixtureDecorator)`
  margin: 1em;
  width: 200px;
`;

function getProps(propsOverrides?: Partial<Props>): Props {
  return {
    ...propsOverrides,
  };
}

export default {
  Regular: (
    <View>
      <QwiltLogo animated={false} {...getProps()} />
    </View>
  ),
  "Regular - Animated": (
    <View>
      <QwiltLogo {...getProps()} />
    </View>
  ),
  "QC Theme": (
    <View>
      <QwiltLogo animated={false} theme={"qc"} {...getProps()} />
    </View>
  ),
  "QC Theme - Animated": (
    <View>
      <QwiltLogo theme={"qc"} {...getProps()} />
    </View>
  ),
};
