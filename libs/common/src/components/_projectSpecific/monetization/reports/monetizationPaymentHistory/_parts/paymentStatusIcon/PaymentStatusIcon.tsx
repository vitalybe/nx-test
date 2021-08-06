import * as React from "react";
import styled, { css } from "styled-components";
import { loggerCreator } from "../../../../../../../utils/logger";
import { DateTime } from "luxon";
import { TextTooltip } from "../../../../../../textTooltip/TextTooltip";

const checkIconSrc = require("../../../../_media/svg/checkIcon.svg");
const pendingInputIconSrc = require("../../../../_media/svg/pendingInputIcon.svg");
const pendingPaymentIconSrc = require("../../../../_media/svg/pendingPaymentIcon.svg");

// noinspection JSUnusedLocalSymbols
const moduleLogger = loggerCreator("__filename");

//region [[ Styles ]]
const tooltipTextCss = css`
  font-size: 0.75rem;
  font-weight: 600;
  opacity: 0.6;
`;
const PaymentStatusIconView = styled.img`
  width: 1.5rem;
  height: 1.5rem;
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  invoiceSentDate: DateTime | undefined;
  allCpPaymentsReceived?: boolean;
  className?: string;
}

//endregion [[ Props ]]

export const PaymentStatusIcon = ({ className, invoiceSentDate, allCpPaymentsReceived }: Props) => {
  const { src, tooltip } = getPaymentStatusAttributes({ invoiceSentDate, allCpPaymentsReceived });
  return (
    <TextTooltip ignoreBoundaries content={tooltip} textCss={tooltipTextCss}>
      <PaymentStatusIconView className={className} src={src} alt={"icon of " + tooltip} />
    </TextTooltip>
  );
};

function getPaymentStatusAttributes(data: {
  allCpPaymentsReceived?: boolean;
  invoiceSentDate: DateTime | undefined;
}): { src: string; tooltip: string | undefined } {
  return {
    src: data.invoiceSentDate ? checkIconSrc : data.allCpPaymentsReceived ? pendingInputIconSrc : pendingPaymentIconSrc,
    tooltip: data.invoiceSentDate
      ? "Invoice sent to Qwilt"
      : data.allCpPaymentsReceived
      ? "Pending invoice date"
      : "Pending content publisher payments",
  };
}
