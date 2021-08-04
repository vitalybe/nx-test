import styled, { css } from "styled-components";
import React, {
  ButtonHTMLAttributes,
  ForwardRefExoticComponent,
  PropsWithoutRef,
  ReactNode,
  RefAttributes,
} from "react";
import { QcButtonTheme, QcButtonThemes } from "common/components/qcComponents/_styled/qcButton/_themes";

//region [[ Props ]]
export interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  isHighlighted?: boolean;
  theme?: QcButtonTheme;
  className?: string;
  children?: ReactNode | null;
  isClickDisabled?: boolean;
}

//endregion [[ Props ]]

export const QcButtonStyledComponent = styled.button<Props>`
  position: relative;
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.75rem 0.5rem;
  min-width: 5rem;
  border-radius: 5px;
  cursor: ${(props) => (props.isClickDisabled || props.disabled ? "default" : "pointer")};
  pointer-events: ${(props) => (props.disabled ? "none" : "inherit")};
  transition: 200ms ease-out, tranform 100ms linear;
  transform: translateY(0);
  opacity: ${(props) => (props.isClickDisabled || props.disabled ? 0.4 : 1)};
  &:focus {
    outline: none;
  }
  ${(props) => getThemeCss(props.isHighlighted, props.theme)}
`;

export const QcButton: ForwardRefExoticComponent<
  PropsWithoutRef<Props> & RefAttributes<HTMLButtonElement>
> = React.forwardRef<HTMLButtonElement>((props: Props, ref) => {
  const buttonOnClick: ButtonHTMLAttributes<HTMLButtonElement>["onClick"] = (...args) => {
    if (!props.isClickDisabled && props.onClick) {
      props.onClick(...args);
    }
  };
  return (
    <QcButtonStyledComponent {...props} ref={ref} onClick={buttonOnClick}>
      {props.children}
    </QcButtonStyledComponent>
  );
});

function getThemeCss(isHighlighted = false, themeOverrides?: QcButtonTheme) {
  const theme: Required<QcButtonTheme> = {
    ...QcButtonThemes.default,
    ...((themeOverrides as QcButtonTheme) ?? {}),
  };
  return css`
    color: ${theme.textColor(isHighlighted)};
    border: solid 1px ${theme.borderColor(isHighlighted)};
    background-color: ${theme.backgroundColor(isHighlighted)};
    &:hover {
      background-color: ${theme.hoverColor(isHighlighted)};
    }
    &:active {
      transform: translateY(2px);
      background-color: ${theme.activeColor(isHighlighted)};
    }
  `;
}
