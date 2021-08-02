import * as React from "react";
import { ReactNode } from "react";
import { FormProvider, useForm, UseFormMethods, UseFormOptions } from "react-hook-form";
import { ObjectSchema, Shape } from "yup";
import { useYupValidationResolver } from "../_hooks/useYupValidationResolver";

//region [[ Props ]]
export interface Props<T extends object> {
  form: UseFormMethods<T>;
  children: ReactNode;
}
//endregion

export function useQcForm<T extends object>(
  scheme: ObjectSchema<Shape<T, object>>,
  options: Partial<UseFormOptions<T>> = {}
): UseFormMethods<T> {
  const resolver = useYupValidationResolver<T>(scheme);
  return useForm<T>({
    mode: "onSubmit",
    resolver,
    ...options,
  });
}

export function QcFormProvider<T extends object>(props: Props<T>) {
  return <FormProvider {...props.form}>{props.children}</FormProvider>;
}
