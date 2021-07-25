/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-console */
import * as React from "react";
import { PropsWithChildren } from "react";
import styled from "styled-components";
import { FormDatePicker, Props } from "common/components/qcComponents/form/formDatePicker/FormDatePicker";
import FixtureDecorator from "common/utils/cosmos/FixtureDecorator";
import { FormProvider, useForm } from "react-hook-form";
import { DateTime } from "luxon";

const View = styled(FixtureDecorator)`
  margin: 1em;
  padding: 1em;
  position: relative;
  border: 3px dashed lightgrey;

  width: 1000px;
  height: 500px;
`;

function getProps(): Props<{ selectedDate: Date }, "selectedDate"> {
  return {
    label: "Select date",
    name: "selectedDate",
    defaultValue: DateTime.local().toJSDate(),
  };
}

function FormWrapper(props: PropsWithChildren<{}>) {
  const form = useForm();
  return <FormProvider {...form}>{props.children}</FormProvider>;
}

export default {
  regular: (
    <View>
      <FormWrapper>
        <FormDatePicker {...getProps()} />
      </FormWrapper>
    </View>
  ),
};
