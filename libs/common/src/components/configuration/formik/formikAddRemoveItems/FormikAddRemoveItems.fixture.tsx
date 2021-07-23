import * as React from "react";
import styled from "styled-components";

import { FormikInput } from "../formikInput/FormikInput";
import { FormikContainer } from "../formikContainer/FormikContainer";
import { FormikAddRemoveItems } from "./FormikAddRemoveItems";

const FormikContainerStyled = styled(FormikContainer)`
  margin: 1rem;
  width: 400px;
  height: 500px;
` as typeof FormikContainer;

const EditorContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  gap: 1rem;
`;

const FormikAddRemoveItemsStyled = styled(FormikAddRemoveItems)`
  flex: 1;
` as typeof FormikAddRemoveItems;

type FormType = { ids: number[] };

export default {
  Regular: (
    <FormikContainerStyled<FormType>
      isEdit={false}
      title={""}
      onOk={async () => {}}
      onCancel={() => {}}
      initialValues={{
        ids: [1, 2, 5],
      }}>
      {(formikProps) => (
        <EditorContent>
          <FormikInput field={"above"} label={"Above"} />
          <FormikAddRemoveItemsStyled<FormType, number>
            formikProps={formikProps}
            label={"IDs"}
            field={"ids"}
            getNewItem={() => 0}>
            {(i: number) => <FormikInput field={`ids[${i}]`} label={"Field"} />}
          </FormikAddRemoveItemsStyled>
          <FormikInput field={"below"} label={"Below"} />
        </EditorContent>
      )}
    </FormikContainerStyled>
  ),
};
