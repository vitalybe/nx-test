import styled from "styled-components";
import { QcButton } from "common/components/qcComponents/_styled/qcButton/QcButton";
import { CommonColors } from "common/styling/commonColors";

const paymentHistoryIcon = require("common/components/_projectSpecific/monetization/_media/icons/billing.svg");
const exportIcon = require("common/components/_projectSpecific/monetization/_media/icons/export.svg");
const backIcon = require("common/components/_projectSpecific/monetization/_media/icons/left-arrow.svg");

export const PaymentHistoryIcon = styled.img.attrs({ src: paymentHistoryIcon, alt: "payment history" })``;
export const ExportIcon = styled.img.attrs({ src: exportIcon, alt: "export" })``;
export const BackIcon = styled.img.attrs({ src: backIcon, alt: "back" })`
  cursor: pointer;
`;

export const TopbarBtn = styled(QcButton)`
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: auto 1fr;
  align-items: center;
  grid-gap: 0.5rem;

  &:first-of-type {
    margin-left: auto;
  }
  padding: 0.5rem;
  background-color: transparent;
`;

export const TopbarTitle = styled.span`
  font-size: 1.25rem;
  font-weight: 600;
`;
export const LogoImg = styled.img`
  height: 2rem;
  margin-left: 1rem;
`;

export const SpLogoPlaceholder = styled.div`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${CommonColors.ARAPAWA};
`;
