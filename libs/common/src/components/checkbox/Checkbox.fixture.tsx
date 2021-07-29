import * as React from "react";
import styled from "styled-components";
import { Checkbox, CheckboxProps } from "common/components/checkbox/Checkbox";
import FixtureDecorator from "common/utils/cosmos/FixtureDecorator";

const View = styled(FixtureDecorator)`
  margin: 1em;
  width: 200px;
`;

function getProps(propsOverrides?: Partial<CheckboxProps>): CheckboxProps {
  return {
    isChecked: false,
    onClick: () => null,
    ...propsOverrides,
  };
}

export default {
  regular: (
    <View>
      <Checkbox {...getProps()} />
    </View>
  ),
  disabled: (
    <View>
      <Checkbox {...getProps()} isDisabled={true} isChecked={true} />
    </View>
  ),
  "with children": (
    <View>
      <Checkbox {...getProps()} isDisabled={true} isChecked={true}>
        <div>Hello there!</div>
      </Checkbox>
    </View>
  ),
};
