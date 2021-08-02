import * as React from "react";
import styled from "styled-components";
import { EntityIcon } from "src/_parts/entityIcon/EntityIcon";
import { EntityIconModel } from "src/_parts/entityIcon/entityIconModel";

import FixtureDecorator from "common/utils/cosmos/FixtureDecorator";

const View = styled(FixtureDecorator)`
  margin: 1em;
`;

const EntityIconStyled = styled(EntityIcon)`
  height: 50px;
`;

export default {
  "Broken ISP": () => {
    const model = EntityIconModel.createMock({
      iconPath: "broken",
      fallbackType: "isp",
    });
    return (
      <View>
        <EntityIconStyled model={model} />
      </View>
    );
  },
  "Broken GEO": () => {
    const model = EntityIconModel.createMock({
      iconPath: "broken",
      fallbackType: "geo",
    });
    return (
      <View>
        <EntityIconStyled model={model} />
      </View>
    );
  },
};
