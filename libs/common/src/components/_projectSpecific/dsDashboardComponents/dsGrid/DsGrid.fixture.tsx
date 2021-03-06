import * as React from "react";
import styled from "styled-components";
import { DsGrid, Props } from "./DsGrid";
import FixtureDecorator from "../../../../utils/cosmos/FixtureDecorator";
import { CommonDsEntity } from "../_domain/commonDsEntity";

const View = styled(FixtureDecorator)`
  margin: 1em;
  padding: 1em;
  position: absolute;
  border: 3px dashed lightgrey;
  width: 100vw;
  height: 100vh;
`;

function getProps(): Props<CommonDsEntity> {
  return {
    data: [
      CommonDsEntity.createCommonEntityMock(1, {
        children: [
          CommonDsEntity.createCommonEntityMock(),
          CommonDsEntity.createCommonEntityMock(),
          CommonDsEntity.createCommonEntityMock(),
        ],
      }),
    ],
    columnDef: [],
    selectedEntity: undefined,
    callbacks: {
      setSelectedEntity: () => null,
      setHoveredEntity: () => null,
      setEntitySorting: () => null,
    },
  };
}

export default {
  "-Regular": (
    <View>
      <DsGrid {...getProps()} />
    </View>
  ),
};
