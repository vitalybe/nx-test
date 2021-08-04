/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-console */
import * as React from "react";
import { PropsWithChildren } from "react";
import styled from "styled-components";
import { FormSelect, Props } from "./FormSelect";
import FixtureDecorator from "common/utils/cosmos/FixtureDecorator";
import { FormProvider, useForm } from "react-hook-form";

const View = styled(FixtureDecorator)`
  margin: 1em;
  padding: 1em;
  border: 3px dashed lightgrey;

  width: 1000px;
  height: 500px;
`;

function getProps(): Props<{ selectInput: string }, "selectInput"> {
  return {
    label: "Select input",
    name: "selectInput",
    defaultValue: "A",
    options: [
      { value: "a", label: "A" },
      { value: "b", label: "B" },
    ],
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
        <FormSelect {...getProps()} />
      </FormWrapper>
    </View>
  ),
};
