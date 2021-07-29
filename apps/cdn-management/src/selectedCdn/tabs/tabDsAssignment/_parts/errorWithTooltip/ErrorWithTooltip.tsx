import * as React from "react";
import { ReactNode } from "react";
import styled from "styled-components";
import { loggerCreator } from "common/utils/logger";
import { Tooltip } from "common/components/Tooltip";

// noinspection JSUnusedLocalSymbols
const moduleLogger = loggerCreator(__filename);

//region [[ Styles ]]

const ErrorWithTooltipView = styled.span`
  cursor: help;
`;

const TooltipContent = styled.div`
  padding: 0.5rem;
  text-align: left;
  width: 20rem;
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  errorsContent: ReactNode[];
  className?: string;
}

//endregion [[ Props ]]

export const ErrorWithTooltip = (props: Props) => {
  return props.errorsContent.length > 0 ? (
    <Tooltip
      placement={"top"}
      content={
        <TooltipContent>
          {props.errorsContent.map((errorContent, i) => (
            <React.Fragment key={i}>
              {i > 0 ? <hr /> : null}
              {errorContent}
            </React.Fragment>
          ))}
        </TooltipContent>
      }>
      <ErrorWithTooltipView className={props.className}>⚠️</ErrorWithTooltipView>
    </Tooltip>
  ) : null;
};
