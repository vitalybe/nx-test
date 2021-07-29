import * as React from "react";
import styled from "styled-components";
import { loggerCreator } from "common/utils/logger";
import { FormikContainer } from "../../../configuration/formik/formikContainer/FormikContainer";
import { ApiOverrideSchema, ApiOverrideSchemaType } from "./_domain/overrideSchema";
import { FormikInput } from "../../../configuration/formik/formikInput/FormikInput";
import { UrlStore } from "common/stores/urlStore/urlStore";
import { API_OVERRIDE_PREFIX } from "common/urlParams/commonUrlParams";
import { ValidationError } from "yup";

// noinspection JSUnusedLocalSymbols
const moduleLogger = loggerCreator(__filename);

//region [[ Styles ]]

const OverrideEditorView = styled(FormikContainer)`
  border-radius: 8px;
  box-shadow: 0 2px 22px 0 rgba(0, 0, 0, 0.5);
  background-color: #ffffff;
  color: #21506e;
  width: 30vw;
` as typeof FormikContainer;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const InputWithExample = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

const Exmaple = styled.i`
  font-size: 0.625rem;
`;
//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  onClose: () => void;
  className?: string;
}

//endregion [[ Props ]]

export const OverrideEditor = (props: Props) => {
  const onOk = async (overrideData: Partial<ApiOverrideSchemaType>) => {
    const override = overrideData as ApiOverrideSchemaType;
    UrlStore.getInstance().setParam(API_OVERRIDE_PREFIX + override.param, override.value);
    props.onClose();
  };

  return (
    <OverrideEditorView<Partial<ApiOverrideSchemaType>>
      title={""}
      isEdit={false}
      initialValues={{}}
      onOk={onOk}
      onCancel={props.onClose}
      initialValidation
      validate={onValidate}>
      {() => (
        <Content>
          <InputWithExample>
            <FormikInput field={"param"} label={"Service Name"} />
            <Exmaple>e.g. qn-deployment</Exmaple>
          </InputWithExample>
          <InputWithExample>
            <FormikInput field={"value"} label={"Override Name"} />
            <Exmaple>e.g. cdn-i-qn-deployment.rnd.cqloud.com</Exmaple>
          </InputWithExample>
        </Content>
      )}
    </OverrideEditorView>
  );
};

function onValidate(overrideData: Partial<ApiOverrideSchemaType>) {
  const errors: Record<string, string> = {};

  try {
    ApiOverrideSchema.validateSync(overrideData, { abortEarly: false });
  } catch (e) {
    if (e instanceof ValidationError) {
      const validationErrors = Object.fromEntries(e.inner.map((e) => [e.path, e.message]));
      Object.assign(errors, validationErrors);
    }
  }

  return errors;
}
