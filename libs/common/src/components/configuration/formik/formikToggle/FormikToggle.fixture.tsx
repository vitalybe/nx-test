import * as React from "react";
import styled from "styled-components";
import { FormikToggle } from "./FormikToggle";
import { Formik } from "formik";

import FixtureDecorator from "../../../../utils/cosmos/FixtureDecorator";

import { CommonColors } from "../../../../styling/commonColors";

const View = styled(FixtureDecorator)`
  margin: 1em;
  padding: 1em;
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
          isEnabled: false,
        }}>
        <FormikToggle field={"isEnabled"} label={"Is Enabled"} />
      </Formik>
    </View>
  ),
};
