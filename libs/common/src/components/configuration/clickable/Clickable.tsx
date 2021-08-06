import * as React from "react";
import { MouseEventHandler, ReactNode } from "react";
import styled from "styled-components";
import { loggerCreator } from "../../../utils/logger";
import { ConfigurationStyles } from "../_styles/configurationStyles";
import { ClickableStyleOptions, CommonStyles } from "../../../styling/commonStyles";

const moduleLogger = loggerCreator("__filename");

type Props = { textColor?: string; className?: string } & ClickableStyleOptions;

const ClickableView = styled.div<Props>`
  user-select: none;
  &:focus {
    outline: none;
  }
  ${(props) => {
    const { textColor, ...otherOptions } = props;

    return CommonStyles.clickableStyle("color", textColor ?? ConfigurationStyles.COLOR_CLICKABLE, otherOptions);
  }}
`;

// NOTE: We can't just expose the View directly because styledComponent doesn't work well with it and attrs
export const Clickable = (props: Props & { children: ReactNode; onClick?: MouseEventHandler<HTMLDivElement> }) => {
  const { onClick, className, ...otherProps } = props;

  return <ClickableView onClick={props.isDisabled ? undefined : onClick} className={className} {...otherProps} />;
};
