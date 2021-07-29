import * as React from "react";
import { ButtonHTMLAttributes, MouseEventHandler, ReactNode } from "react";
import styled, { css } from "styled-components";
import { loggerCreator } from "common/utils/logger";
import { ConfigurationStyles } from "common/components/configuration/_styles/configurationStyles";
import { ClickableStyleOptions, CommonStyles } from "common/styling/commonStyles";
import { TextTooltip } from "common/components/textTooltip/TextTooltip";

const moduleLogger = loggerCreator(__filename);

type Props = {
  textColor?: string;
  backgroundColor?: string;
  disabledTooltip?: string;
} & ClickableStyleOptions;

const ButtonView = styled.button<Props>`
  ${(props) => {
    const { backgroundColor, textColor, ...otherOptions } = props;

    return css`
      color: ${(props) => textColor ?? ConfigurationStyles.COLOR_BUTTON_TEXT};
      outline: 0;
      border: 0;

      text-align: center;
      border-radius: 5px;
      padding: 0.5rem 0.5rem;
      min-width: 100px;

      ${CommonStyles.clickableStyle(
        "background-color",
        backgroundColor ?? ConfigurationStyles.COLOR_BUTTON_BACKGROUND,
        otherOptions
      )}
    `;
  }}
`;

// NOTE: We can't just expose the View directly because styledComponent doesn't work well with it and attrs
export const Button = (
  props: Props & {
    children: ReactNode;
    onClick?: MouseEventHandler<HTMLButtonElement>;
    buttonAttributes?: ButtonHTMLAttributes<HTMLButtonElement>;
  }
) => {
  const button = (
    <ButtonView {...props} {...props.buttonAttributes} onClick={props.isDisabled ? undefined : props.onClick} />
  );

  if (props.isDisabled && props.disabledTooltip) {
    return <TextTooltip content={props.disabledTooltip}>{button}</TextTooltip>;
  } else {
    return button;
  }
};
