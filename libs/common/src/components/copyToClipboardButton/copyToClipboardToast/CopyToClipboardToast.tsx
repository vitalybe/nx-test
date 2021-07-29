import * as React from "react";
import styled from "styled-components";
import { loggerCreator } from "../../../utils/logger";
import { ConfigurationStyles } from "../../configuration/_styles/configurationStyles";
import { toast } from "react-toastify";
import { CommonColors } from "../../../styling/commonColors";

const moduleLogger = loggerCreator("__filename");

//region [[ Styles ]]

const CopyToClipboardToastView = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  background: ${CommonColors.ROYAL_BLUE};
  box-shadow: ${ConfigurationStyles.SHADOW};
  padding: 1.5em;
  position: relative;
  flex: 1;
`;

const Title = styled.span`
  font-size: 14px;
  color: white;
`;
//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  title?: string;

  className?: string;
}
//endregion [[ Props ]]

export const CopyToClipboardToast = (props: Props) => {
  return (
    <CopyToClipboardToastView>
      <Title>{props.title ?? "Copied to Clipboard !"}</Title>
    </CopyToClipboardToastView>
  );
};

export function copyToClipboardToast(props?: Props) {
  toast(CopyToClipboardToast({ ...props }), {
    position: "bottom-center",
    autoClose: 1500,
    draggable: false,
    draggablePercent: 0,
    closeOnClick: true,
    closeButton: false,
    hideProgressBar: true,
  });
}
