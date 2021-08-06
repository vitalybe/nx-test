import * as React from "react";
import styled from "styled-components";
import { FormikSelect, Props } from "./FormikSelect";
import { Formik } from "formik";

import FixtureDecorator from "../../../../utils/cosmos/FixtureDecorator";

const View = styled(FixtureDecorator)`
  margin: 1em;
  width: 200px;
`;

function getProps(propsOverrides?: Partial<Props>): Props {
  return {
    field: "id",
    label: "Id",
    ...propsOverrides,
  };
}

export default {
  Regular: (
    <View>
      <Formik onSubmit={() => {}} initialValues={{}}>
        {({}) => (
          <FormikSelect {...getProps()}>
            <option value="1">Option 1</option>
            <option value="2">Option 2</option>
            <option value="3">Option 3</option>
          </FormikSelect>
        )}
      </Formik>
    </View>
  ),
};
