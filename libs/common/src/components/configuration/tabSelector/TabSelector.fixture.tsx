/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-console */
import * as React from "react";
import styled from "styled-components";
import { TabSelector, Props } from "./TabSelector";
import FixtureDecorator from "../../../utils/cosmos/FixtureDecorator";
import { TabRouterTabStore, TabRouterTabStoreContextProvider } from "../../tabRouter/_stores/tabRouterTabStore";
import { DateTime } from "luxon";

const View = styled(FixtureDecorator)`
  margin: 1em;
  position: absolute;
  border: 3px dashed lightgrey;
`;

function getProps(): Props {
  return {
    title: "Title",

    isLoading: false,
    lastLoadDate: DateTime.local(),
    subtitle: <div>🙀 5</div>,
  };
}

export default {
  regular: (
    <View>
      <TabRouterTabStoreContextProvider store={new TabRouterTabStore(true)}>
        <TabSelector {...getProps()} />
      </TabRouterTabStoreContextProvider>
    </View>
  ),
};
