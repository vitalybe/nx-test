import * as React from "react";
import styled from "styled-components";
import { FormikInput } from "common/components/configuration/formik/formikInput/FormikInput";
import { Formik } from "formik";

import FixtureDecorator from "common/utils/cosmos/FixtureDecorator";

const View = styled(FixtureDecorator)`
  margin: 1em;
  width: 200px;
`;

export default {
  Regular: (
    <View>
      <Formik
        onSubmit={() => {}}
        initialValues={{
          id: "",
        }}>
        {({}) => <FormikInput field={"id"} label={"id"} />}
      </Formik>
    </View>
  ),
};
