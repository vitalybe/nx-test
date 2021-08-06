import * as React from "react";
import styled from "styled-components";
import { loggerCreator } from "../../utils/logger";
import {
  copyToClipboardToast,
  Props as ToastProps,
} from "./copyToClipboardToast/CopyToClipboardToast";
import { Icons } from "../../styling/icons";
import { CommonColors } from "../../styling/commonColors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CopyToClipboard from "react-copy-to-clipboard";
import { Clickable } from "../configuration/clickable/Clickable";

const moduleLogger = loggerCreator("__filename");

//region [[ Styles ]]

const CopyButton = styled(Clickable).attrs({ textColor: CommonColors.NAVY_8 })`
  width: fit-content;
`;

const CopyButtonIcon = styled(FontAwesomeIcon)`
  margin-right: 0.3em;
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  textToCopy: string;
  title?: string;
  disableToast?: boolean;
  toastOptions?: ToastProps;

  className?: string;
}

//endregion [[ Props ]]

export const CopyToClipboardButton = (props: Props) => {
  return (
    <CopyToClipboard text={props.textToCopy}>
      <CopyButton onClick={() => (props.disableToast ? {} : copyToClipboardToast(props.toastOptions))}>
        <CopyButtonIcon icon={Icons.COPY} />
        <span>{props.title ?? "Copy to Clipboard"}</span>
      </CopyButton>
    </CopyToClipboard>
  );
};
