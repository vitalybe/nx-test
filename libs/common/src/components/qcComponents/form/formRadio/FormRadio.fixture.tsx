/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-console */
import * as React from "react";
import { PropsWithChildren } from "react";
import styled from "styled-components";
import { FormRadio, Props } from "./FormRadio";
import FixtureDecorator from "common/utils/cosmos/FixtureDecorator";
import { FormProvider, useForm } from "react-hook-form";

const View = styled(FixtureDecorator)`
  margin: 1em;
  padding: 1em;
  border: 3px dashed lightgrey;

  width: 1000px;
  height: 500px;
`;

function getProps(): Props<{ type: string }, "type"> {
  return {
    label: "Select type",
    name: "type",
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
        <FormRadio {...getProps()} />
      </FormWrapper>
    </View>
  ),
};
