/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-console */
import * as React from "react";
import styled from "styled-components";
import { Props, QcForm } from "common/components/qcComponents/form/qcForm/QcForm";
import FixtureDecorator from "common/utils/cosmos/FixtureDecorator";
import * as yup from "yup";
import { FormInput } from "common/components/qcComponents/form/formInput/FormInput";
import { useQcForm } from "../_parts/QcFormProvider";

const View = styled(FixtureDecorator)`
  margin: 1em;
  padding: 1em;
  position: relative;
  border: 3px dashed lightgrey;

  width: 1000px;
  height: 500px;
`;
const scheme = yup
  .object()
  .shape<FormData>({ a: yup.string().required() })
  .defined();
type FormData = { a: string };

function getProps(): Omit<Props<FormData>, "children" | "form"> {
  return {
    onSubmit: (data: FormData) => console.log(data),
  };
}

export default {
  regular: () => {
    const form = useQcForm(scheme);
    return (
      <View>
        <QcForm {...getProps()} form={form}>
          <FormInput name={"a"} label={"A"} />
        </QcForm>
      </View>
    );
  },
};
