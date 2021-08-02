import * as React from "react";
import styled from "styled-components";
import { FormikContainer, Props } from "common/components/configuration/formik/formikContainer/FormikContainer";
import { mockUtils } from "common/utils/mockUtils";

import FixtureDecorator from "common/utils/cosmos/FixtureDecorator";

const View = styled(FixtureDecorator)`
  margin: 1em;
  width: 500px;
  border: 3px dashed lightgrey;
`;

interface T {}

function getProps(propsOverrides?: Partial<Props<T>>): Props<T> {
  return {
    title: "CDN",
    isEdit: true,
    onOk: mockUtils.mockAsyncAction("onOk"),
    onCancel: mockUtils.mockAction("onCancel"),
    initialValues: {},
    children: () => <div>Hello world</div>,
    ...propsOverrides,
  };
}

export default {
  Edit: (
    <View>
      <FormikContainer
        {...getProps({
          isEdit: true,
        })}>
        {() => <div>Hello</div>}
      </FormikContainer>
    </View>
  ),
  Create: (
    <View>
      <FormikContainer
        {...getProps({
          isEdit: false,
        })}>
        {() => <div>Hello</div>}
      </FormikContainer>
    </View>
  ),
};
