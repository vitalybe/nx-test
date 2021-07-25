import * as _ from "lodash";
import * as React from "react";
import styled, { FlattenSimpleInterpolation as StyledCSS } from "styled-components";
import { loggerCreator } from "../../utils/logger";
import { Props as TooltipProps, Tooltip } from "../Tooltip";
import {
  CopyToClipboardButton,
  Props as CopyToClipboardProps,
} from "../copyToClipboardButton/CopyToClipboardButton";
import { ReactNode } from "react";

const moduleLogger = loggerCreator("__filename");

//region [[ Styles ]]
const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-height: 300px;
  overflow-y: auto;
`;

const TextContent = styled.div<{ customStyles?: StyledCSS; textAlign?: string }>`
  padding: 0.5rem;
  font-weight: inherit;
  font-size: 0.875rem;
  text-align: ${(props) => props.textAlign || "center"};

  ${(props) => props.customStyles}
`;

const CopyToClipboardButtonContainer = styled.div`
  padding: 5px;
  width: 100%;
`;

//endregion

export interface Props extends Omit<TooltipProps, "content"> {
  content: string | ReactNode;
  copyToClipboardOptions?: CopyToClipboardProps;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: React.ReactElement;
  // allows passing styled.css definitions directly to the tooltip inner text element
  textCss?: StyledCSS;
  className?: string;
}

function breakTextToLines(content: string) {
  return content.split ? (
    content.split("\n").map(function (item, key) {
      return (
        <span key={key}>
          {item}
          <br />
        </span>
      );
    })
  ) : (
    <span>{content}</span>
  );
}

export const TextTooltip = ({ ...props }: Props) => {
  const tippyProps = _.omit(props, ["content", "textCss", "copyToClipboardOptions", "className"]);

  return (
    <Tooltip
      disabled={props.content === ""}
      delay={100}
      {...tippyProps}
      content={
        <ContentContainer className={props.className}>
          <TextContent customStyles={props.textCss}>
            {typeof props.content === "string" ? breakTextToLines(props.content) : props.content}
          </TextContent>
          {!!props.copyToClipboardOptions && (
            <CopyToClipboardButtonContainer>
              <CopyToClipboardButton {...props.copyToClipboardOptions} />
            </CopyToClipboardButtonContainer>
          )}
        </ContentContainer>
      }>
      {props.children}
    </Tooltip>
  );
};
