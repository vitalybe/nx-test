import * as React from "react";
import styled from "styled-components";
import { ReportsScreen, Props } from "src/reportsScreen/ReportsScreen";
import { FixtureDecorator } from "common/index";

const View = styled(FixtureDecorator)`
  margin: 1em;
  padding: 1em;
  position: absolute;
  border: 3px dashed lightgrey;
`; // eslint-disable-next-line @typescript-eslint/no-explicit-any

// eslint-disable-next-line @typescript-eslint/no-explicit-any

function getProps(propsOverrides?: Partial<Props>): Props {
  return {
    qnList: [],
    ...propsOverrides,
  };
}

export default {
  "-Regular": (
    <View>
      <ReportsScreen {...getProps()} />
    </View>
  ),
};
