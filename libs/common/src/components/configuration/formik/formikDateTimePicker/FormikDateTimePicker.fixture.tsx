/* eslint-disable react-hooks/rules-of-hooks */
import * as React from "react";
import styled from "styled-components";
import {
  FormikDateTimePicker,
  Props,
} from "./FormikDateTimePicker";
import FixtureDecorator from "../../../../utils/cosmos/FixtureDecorator";
import { Formik, FormikProps } from "formik";

import { DateTime } from "luxon";

const View = styled(FixtureDecorator)`
  margin: 1em;
  padding: 1em;
  position: relative;
  border: 3px dashed lightgrey;

  width: 1000px;
  height: 500px;
`;

const Results = styled.div`
  margin-top: 2rem;
`;

function getProps(): Props {
  return {
    field: "value",
    label: "My Date",
  };
}

export default {
  noInitialValue: (
    <View>
      <Formik onSubmit={() => {}} initialValues={{ value: undefined }}>
        {(formikProps: FormikProps<{ value: DateTime | undefined }>) => (
          <>
            <FormikDateTimePicker {...getProps()}></FormikDateTimePicker>
            <Results>Values: {JSON.stringify(formikProps.values.value)}</Results>
          </>
        )}
      </Formik>
    </View>
  ),

  withInitialValue: (
    <View>
      <Formik onSubmit={() => {}} initialValues={{ value: DateTime.local(2012, 12, 7) }}>
        {(formikProps: FormikProps<{ value: DateTime | undefined }>) => (
          <>
            <FormikDateTimePicker {...getProps()}></FormikDateTimePicker>
            <Results>Values: {JSON.stringify(formikProps.values.value)}</Results>
          </>
        )}
      </Formik>
    </View>
  ),
};
