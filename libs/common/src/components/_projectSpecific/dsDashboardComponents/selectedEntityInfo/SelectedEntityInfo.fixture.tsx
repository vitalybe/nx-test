import * as React from "react";
import styled from "styled-components";
import {
  Props,
  SelectedEntityInfo,
} from "./SelectedEntityInfo";
import {
  CommonDsEntity,
  DsEntityType,
} from "../_domain/commonDsEntity";

import FixtureDecorator from "../../../../utils/cosmos/FixtureDecorator";

const View = styled(FixtureDecorator)`
  margin: 1em;
  padding: 1em;
  width: 700px;
  border: 3px dashed lightgrey;
`;

const entity = new CommonDsEntity("1", {
  name: "ISP-1",
  type: DsEntityType.DS,
  children: [
    new CommonDsEntity("1", {
      name: "DSG-1",
      type: DsEntityType.DS,
      children: [
        new CommonDsEntity("1", {
          name: "DS-1",
          type: DsEntityType.DS,
        }),
      ],
    }),
  ],
});
function getProps(): Props<CommonDsEntity> {
  return {
    selectedEntity: entity,
    setSelectedEntityId: () => null,
  };
}

export default {
  "-Regular": (
    <View>
      <SelectedEntityInfo {...getProps()} />
    </View>
  ),
  "-Selected Child": (
    <View>
      <SelectedEntityInfo {...getProps()} selectedEntity={entity.children?.[0].children?.[0]} />
    </View>
  ),
};
