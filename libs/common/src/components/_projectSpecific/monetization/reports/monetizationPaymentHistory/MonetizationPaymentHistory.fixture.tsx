/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-console */
import * as React from "react";
import styled from "styled-components";
import FixtureDecorator from "common/utils/cosmos/FixtureDecorator";
import { MonetizationPaymentHistory, Props } from "./MonetizationPaymentHistory";
import { GridValueRenderer } from "../../../../qwiltGrid/QwiltGrid";

const View = styled(FixtureDecorator)`
  margin: 1em;
  position: relative;
  border: 3px dashed lightgrey;

  width: 90%;
  height: 800px;
`;

function getProps(): Props<{ a: string; b: string }> {
  return {
    backFn(): void {},
    isEditEnabled: true,
    columns: [
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
    ],
    rows: [{ a: "Foo", b: "Bar" }],
    total: 120_000,
    yearOptions: [{ label: "2021", value: 2021 }],
    selectedYear: 2021,
    org: { name: "Digital Alpha" },
    setSelectedYear() {},
    refreshFn() {},
    exportCallback() {},
    editCallback(): Promise<boolean> {
      return Promise.resolve(false);
    },
  };
}

export default {
  regular: (
    <View>
      <MonetizationPaymentHistory {...getProps()} />
    </View>
  ),
};
