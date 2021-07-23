/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-console */
import * as React from "react";
import { PropsWithChildren, ReactNode } from "react";
import styled from "styled-components";
import { FormInput, Props } from "common/components/qcComponents/form/formInput/FormInput";
import FixtureDecorator from "common/utils/cosmos/FixtureDecorator";
import { FormProvider, useForm, UseFormMethods } from "react-hook-form";

const View = styled(FixtureDecorator)`
  margin: 1em;
  padding: 1em;
  position: relative;
  border: 3px dashed lightgrey;

  width: 1000px;
  height: 500px;
`;

function getProps(): Props<{ label: string }, "label"> {
  return {
    label: "Input label",
    name: "label",
    placeholder: "input label placeholder",
  };
}

function FormProviderView({ children, ...props }: PropsWithChildren<Partial<UseFormMethods>>) {
  const form = useForm();

  return (
    <View>
      <FormProvider {...form} {...props}>
        {children}
      </FormProvider>
    </View>
  );
}
function ErrorWrapper({ children }: { children?: ReactNode }) {
  return (
    <FormProviderView errors={{ label: { type: "validation", message: "Label is required" } }}>
      {children}
    </FormProviderView>
  );
}

export default {
  regular: (
    <FormProviderView>
      <FormInput {...getProps()} />
    </FormProviderView>
  ),
  "error state": (
    <ErrorWrapper>
      <FormInput {...getProps()} />
    </ErrorWrapper>
  ),
};
