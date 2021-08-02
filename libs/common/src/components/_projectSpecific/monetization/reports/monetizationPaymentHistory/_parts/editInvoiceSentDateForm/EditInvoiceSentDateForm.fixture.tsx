/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-console */
import * as React from "react";
import styled from "styled-components";
import { EditInvoiceSentDateForm, Props } from "./EditInvoiceSentDateForm";
import FixtureDecorator from "../../../../../../../utils/cosmos/FixtureDecorator";
import { MonetizationPaymentEntity } from "../../../../_domain/monetizationPaymentEntity";

const View = styled(FixtureDecorator)`
  margin: 1em;
  padding: 1em;
  position: relative;
  border: 3px dashed lightgrey;

  width: 1000px;
  height: 500px;
`;

function getProps(): Props<MonetizationPaymentEntity> {
  return {
    payments: [
      MonetizationPaymentEntity.createMock({
        allCpPaymentsReceived: true,
      }),
    ],
    closeFn(): void {},
    onEdit() {
      return Promise.resolve();
    },
  };
}

export default {
  regular: (
    <View>
      <EditInvoiceSentDateForm {...getProps()} />
    </View>
  ),
};
