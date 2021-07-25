import * as React from "react";
import styled from "styled-components";
import { FormikText, Props } from "common/components/configuration/formik/formikText/FormikText";
import FixtureDecorator from "common/utils/cosmos/FixtureDecorator";

const View = styled(FixtureDecorator)`
  margin: 1em;
  padding: 1em;
  position: absolute;
  border: 3px dashed lightgrey;
`;

function getProps(propsOverrides?: Partial<Props>): Props {
  return {
    text: "test",
    label: "label",
    ...propsOverrides,
  };
}

export default {
  "-Regular": (
    <View>
      <FormikText {...getProps()} />
    </View>
  ),
};
