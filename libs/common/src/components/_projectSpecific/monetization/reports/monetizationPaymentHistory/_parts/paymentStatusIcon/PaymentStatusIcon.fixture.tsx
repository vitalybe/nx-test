/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-console */
import * as React from "react";
import styled from "styled-components";
import FixtureDecorator from "../../../../../../../utils/cosmos/FixtureDecorator";
import { DateTime } from "luxon";
import { PaymentStatusIcon, Props } from "./PaymentStatusIcon";

const View = styled(FixtureDecorator)`
  margin: 1em;
  padding: 1em;
  position: relative;
  border: 3px dashed lightgrey;

  width: 1000px;
  height: 500px;
`;

function getProps(): Props {
  return {
    allCpPaymentsReceived: true,
    invoiceSentDate: DateTime.local(),
  };
}

export default {
  regular: (
    <View>
      <PaymentStatusIcon {...getProps()} />
    </View>
  ),
};
