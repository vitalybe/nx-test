/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-console */
import * as React from "react";
import styled from "styled-components";
import {
  FormInputContainer,
  Props,
} from "common/components/qcComponents/form/_parts/formInputContainer/FormInputContainer";
import FixtureDecorator from "common/utils/cosmos/FixtureDecorator";

const View = styled(FixtureDecorator)`
  margin: 1em;
  padding: 1em;
  position: relative;
  border: 3px dashed lightgrey;

  width: 1000px;
  height: 500px;
`;

function getProps(): Omit<Props, "children"> {
  return {
    label: "Contained input label",
  };
}

export default {
  regular: (
    <View>
      <FormInputContainer {...getProps()}>
        <input placeholder={"im a contained input"} />
      </FormInputContainer>
    </View>
  ),
};
