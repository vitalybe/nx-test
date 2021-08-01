import * as React from "react";
import styled from "styled-components";
import { FormikJson } from "common/components/configuration/formik/formikJson/FormikJson";
import { Formik, FormikProps } from "formik";

import FixtureDecorator from "common/utils/cosmos/FixtureDecorator";
import { CommonColors } from "common/styling/commonColors";

const View = styled(FixtureDecorator)`
  margin: 1em;
  padding: 1em;
  width: 600px;
  position: absolute;
  border: 3px dashed lightgrey;
  background-color: ${CommonColors.MYSTIC_2};
`;

export default {
  "-Regular": (
    <View>
      <Formik
        onSubmit={() => {}}
        initialValues={{
          value: {
            a: 1,
            b: "2",
          },
        }}>
        {(
          formikProps: FormikProps<{
            value: object;
          }>
        ) => (
          <>
            <FormikJson
              field={"value"}
              label={"Configuration"}
              disabled={false}
              minimized={false}
              canMinimize={true}
              value={formikProps.values.value || null}
            />
            <div>Values: {JSON.stringify(formikProps.values.value)}</div>
            <div>Errors: {JSON.stringify(formikProps.errors)}</div>
          </>
        )}
      </Formik>
    </View>
  ),
  "-Mock": (
    <View>
      <Formik
        onSubmit={() => {}}
        initialValues={{
          isEnabled: false,
        }}>
        <FormikJson
          value={{
            a: 1,
            b: "2",
          }}
          field={"config"}
          label={"Configuration"}
          disabled={false}
          minimized={false}
          canMinimize={true}
        />
      </Formik>
    </View>
  ),
};
