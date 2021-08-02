import * as React from "react";
import styled from "styled-components";
import { Props, TopBarSearchOption } from "src/topBar/topBarSearch/_parts/topBarSearchOption/TopBarSearchOption";
import { TopBarSearchOptionModel } from "src/topBar/topBarSearch/_parts/topBarSearchOption/topBarSearchOptionModel";

import FixtureDecorator from "common/utils/cosmos/FixtureDecorator";

import { EntityIconModel } from "src/_parts/entityIcon/entityIconModel";

const View = styled(FixtureDecorator)`
  margin: 1em;
  width: 300px;
  border: 3px dashed lightgrey;
`;

function getProps(overrides?: Partial<TopBarSearchOptionModel>, propsOverrides?: Partial<Props>): Props {
  return {
    data: TopBarSearchOptionModel.createMock(overrides),
    selectProps: { inputValue: "" },
    isFocused: false,
    setValue: () => console.log("setting value"),
    ...propsOverrides,
  };
}

export default {
  Regular: (
    <View>
      <TopBarSearchOption {...getProps()} />
    </View>
  ),
  "No service": () => {
    const props = getProps({
      isDisabled: true,
    });
    return <TopBarSearchOption {...props} />;
  },
  "ISP - Broken image": () => {
    const props = getProps({
      entityIcon: EntityIconModel.createMock({
        iconPath: "broken",
      }),
    });
    return <TopBarSearchOption {...props} />;
  },
};
