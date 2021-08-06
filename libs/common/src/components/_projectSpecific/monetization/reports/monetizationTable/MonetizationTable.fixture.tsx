/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-console */
import * as React from "react";
import styled from "styled-components";
import {
  MonetizationTable,
  Props,
} from "./MonetizationTable";
import FixtureDecorator from "../../../../../utils/cosmos/FixtureDecorator";
import { GridValueRenderer } from "../../../../qwiltGrid/QwiltGrid";

const View = styled(FixtureDecorator)`
  margin: 1em;
  padding: 1em;
  position: relative;
  border: 3px dashed lightgrey;

  width: 1000px;
  height: 500px;
`;

function getProps(): Props<{ a: string; b: string; c: string }> {
  return {
    title: "Monetization Table",
    rows: [{ a: "1", b: "2", c: "3" }],
    columnDef: [
      {
        headerName: "A",
        renderer: new GridValueRenderer({
          valueGetter: (entity) => entity.a,
        }),
      },
      {
        headerName: "B",
        renderer: new GridValueRenderer({
          valueGetter: (entity) => entity.b,
        }),
      },
      {
        headerName: "C",
        renderer: new GridValueRenderer({
          valueGetter: (entity) => entity.c,
        }),
      },
    ],
  };
}

export default {
  regular: (
    <View>
      <MonetizationTable {...getProps()} />
    </View>
  ),
};
