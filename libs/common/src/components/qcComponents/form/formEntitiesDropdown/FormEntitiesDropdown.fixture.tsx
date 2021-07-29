/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-console */
import * as React from "react";
import { PropsWithChildren } from "react";
import styled from "styled-components";
import { FormEntitiesDropdown, Props } from "./FormEntitiesDropdown";
import FixtureDecorator from "../../../../utils/cosmos/FixtureDecorator";
import { DropdownEntity } from "../../../entitiesDropdown/_domain/dropdownEntity";
import { FormProvider, useForm, UseFormMethods } from "react-hook-form";

const View = styled(FixtureDecorator)`
  margin: 1em;
  padding: 1em;
  position: relative;
  border: 3px dashed lightgrey;

  width: 1000px;
  height: 500px;
`;

function getProps(): Props<{ networks: string[] }, "networks"> {
  return {
    name: "networks",
    label: "select networks",
    selectionMode: "multipleApplyOnButton",
    items: [DropdownEntity.createMock(), DropdownEntity.createMock(), DropdownEntity.createMock()],
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

export default {
  regular: (
    <FormProviderView>
      <FormEntitiesDropdown {...getProps()} />
    </FormProviderView>
  ),
};
