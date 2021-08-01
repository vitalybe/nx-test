import * as React from "react";
import styled, { css, FlattenSimpleInterpolation as StyledCSS } from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { transparentize } from "polished";
import { CalendarStyles } from "../../_calendarStyles";
import { CommonColors } from "../../../../styling/commonColors";
import { CommonStyles } from "../../../../styling/commonStyles";
import { loggerCreator } from "../../../../utils/logger";
import { Button } from "../../../configuration/button/Button";

const moduleLogger = loggerCreator("__filename");

//region [[ Styles ]]

const CLEAR_BUTTON_SIZE = "32px";

const CalendarButtonRawView = styled.div`
  display: flex;
  position: relative;
  outline: none;
  align-items: center;
`;

export const ButtonPart = styled.div<{ isHighlighted: boolean; customStyles?: StyledCSS }>`
  text-align: center;
  border-radius: 16px;
  padding: 0.5em;
  display: flex;
  align-items: center;
  min-width: ${CalendarStyles.DURATION_BUTTON_WIDTH};
  justify-content: center;

  ${(props) =>
    props.isHighlighted
      ? css`
          // Add additional space on the right for the X
          padding: 0.5em calc(0.2em + ${CLEAR_BUTTON_SIZE}) 0.5em 0.5em;
          background-color: ${CommonColors.ROYAL_BLUE};
          color: ${CommonColors.ATHENS_GRAY};
          ${CommonStyles.clickableStyle("background-color", CommonColors.ROYAL_BLUE, { colorFunction: "darken" })}
        `
      : CommonStyles.clickableStyle("background-color", "rgba(0,0,0,0)", {
          hoverColor: transparentize(0.8, CommonColors.ROYAL_BLUE),
          activeColor: transparentize(0.7, CommonColors.ROYAL_BLUE),
        })};

  ${(props) => props.customStyles};
`;

const CalendarIconSvg = styled.svg<{}>`
  position: relative;
  top: -1px;
  height: 20px;
`;

const Label = styled.div<{ color: string }>`
  color: ${(props) => props.color};
  margin-left: 0.5em;
`;

const ClearButton = styled(Button).attrs({
  backgroundColor: CommonColors.ROYAL_BLUE,
  textColor: CommonColors.ATHENS_GRAY,
  colorFunction: "darken",
})`
  padding: 0;
  min-width: ${CLEAR_BUTTON_SIZE};
  position: absolute;
  align-items: center;
  right: calc(${CLEAR_BUTTON_SIZE} / 2 - 16px);
  width: ${CLEAR_BUTTON_SIZE};
  height: ${CLEAR_BUTTON_SIZE};
  line-height: ${CLEAR_BUTTON_SIZE};
  border-radius: 50%;
  text-align: center;
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  isHighlighted: boolean;
  label?: string;
  customStyles?: StyledCSS;

  onClear?: () => void;

  className?: string;
}

//endregion [[ Props ]]

export const CalendarButtonRaw = (props: Props) => {
  const color = props.isHighlighted ? CommonColors.WHITE : CommonColors.ROYAL_BLUE;

  return (
    <CalendarButtonRawView className={props.className}>
      <ButtonPart isHighlighted={props.isHighlighted} customStyles={props.customStyles}>
        <CalendarIconSvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
          <defs>
            <path
              id="b"
              d="M11.5 1a.5.5 0 0 1 .5.5V3a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2V1.5a.5.5 0 0 1 1 0V3h6V1.5a.5.5 0 0 1 .5-.5zm.5 6H4a1.99 1.99 0 0 1-1-.268V13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l.001-6.268A1.99 1.99 0 0 1 12 7zM6 8v2H4V8h2z"
            />
            <filter id="a" width="475%" height="421.4%" x="-187.5%" y="-160.7%" filterUnits="objectBoundingBox">
              <feOffset in="SourceAlpha" result="shadowOffsetOuter1" />
              <feGaussianBlur in="shadowOffsetOuter1" result="shadowBlurOuter1" stdDeviation="7.5" />
              <feColorMatrix
                in="shadowBlurOuter1"
                values="0 0 0 0 0.654901961 0 0 0 0 0.77254902 0 0 0 0 0.850980392 0 0 0 0.2 0"
              />
            </filter>
          </defs>
          <g fill="none" fillRule="evenodd">
            <use fill="#000" filter="url(#a)" href="#b" />
            <use fill={color} href="#b" />
          </g>
        </CalendarIconSvg>
        {props.label && <Label color={color}>{props.label.toUpperCase()}</Label>}
      </ButtonPart>
      {props.isHighlighted && props.onClear && (
        <ClearButton onClick={() => props.onClear?.()}>
          <FontAwesomeIcon icon={faTimes} />
        </ClearButton>
      )}
    </CalendarButtonRawView>
  );
};
