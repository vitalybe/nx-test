import * as React from "react";
import styled from "styled-components";
import { Props, TopBarSearchOption } from "./TopBarSearchOption";
import { TopBarSearchOptionModel } from "./topBarSearchOptionModel";

import FixtureDecorator from "@qwilt/common/utils/cosmos/FixtureDecorator";

import { EntityIconModel } from "../../../../_parts/entityIcon/entityIconModel";

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
    setValue: () => {},
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
