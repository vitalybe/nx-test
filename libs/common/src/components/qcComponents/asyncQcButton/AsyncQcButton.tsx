import * as React from "react";
import { PropsWithChildren, ReactNode } from "react";
import styled from "styled-components";
import { loggerCreator } from "../../../utils/logger";
import { Props as ControlButtonProps, QcButton } from "../_styled/qcButton/QcButton";
import { useProgressPercent } from "../../../utils/hooks/useProgressPercent";
import { Duration } from "luxon";
import { darken } from "polished";
import { Tooltip } from "../../Tooltip";
import { CommonColors } from "../../../styling/commonColors";
import { QcButtonThemes } from "../_styled/qcButton/_themes";

const moduleLogger = loggerCreator("__filename");

//region [[ Styles ]]

const ErrorTooltipContent = styled.div`
  padding: 0.5rem;
  background-color: ${CommonColors.RADICAL_RED};
  color: white;
  font-weight: 600;
  font-size: 0.75rem;
`;

const ProgressBackground = styled.div<{ progressPercent: number; color: string }>`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  top: 0;

  width: ${(props) => props.progressPercent}%;
  background-color: ${(props) => darken(0.15, props.color)};
  transition: 0.5s ease;
  opacity: ${(props) => (props.progressPercent === 0 ? 0 : 0.3)};
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props extends ControlButtonProps {
  isLoading?: boolean;
  minLoadingProgress?: number;
  isError?: boolean;
  errorText?: ReactNode;
  finishFn?: () => void;
  className?: string;
}

//endregion [[ Props ]]

export const AsyncQcButton = ({
  className,
  isLoading = false,
  minLoadingProgress = 0,
  isError = false,
  isHighlighted = false,
  theme = QcButtonThemes.default,
  children,
  ...props
}: PropsWithChildren<Props>) => {
  const progress = useProgressPercent(
    isLoading,
    Duration.fromObject({ seconds: 6 }),
    props.finishFn,
    minLoadingProgress
  );
  return (
    <Tooltip
      ignoreBoundaries
      trigger={"manual"}
      isVisible={isError}
      hideOnClick
      theme={"error-tooltip"}
      content={<ErrorTooltipContent>{props.errorText ?? "Submission Failed"}</ErrorTooltipContent>}
      placement={"top"}>
      <QcButton
        className={className}
        isHighlighted={isHighlighted}
        theme={theme}
        {...props}
        onClick={(e) => (!isLoading ? props.onClick?.(e) : undefined)}>
        <ProgressBackground
          color={theme.hoverColor?.(isHighlighted) ?? CommonColors.PATTENS_BLUE}
          progressPercent={progress}
        />
        {children}
      </QcButton>
    </Tooltip>
  );
};
