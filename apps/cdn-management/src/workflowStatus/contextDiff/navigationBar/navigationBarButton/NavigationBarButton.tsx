import * as React from "react";
import styled, { css } from "styled-components";
import { loggerCreator } from "@qwilt/common/utils/logger";
import { Colors } from "../../../../_styling/colors";
import { ContextDiffEntityTypeEnum } from "../../_domain/contextEntityType";
import { OverflowingText } from "@qwilt/common/components/overflowingText/OverflowingText";

const moduleLogger = loggerCreator("__filename");

//region [[ Styles ]]

const arrowSize = "0.9rem";
const arrowLeft = "-14px";
const hoverColor = "#dce6ea";
const activeColor = "#c7d7de";
const clickableCss = css`
  cursor: pointer;
  transition: 0.2s ease;
`;

const NavigationBarButtonView = styled.div<{ isSelected: boolean; hasArrow: boolean }>`
  border: 1px solid ${Colors.JUNGLE_MIST};
  color: black;
  border-radius: 5px;
  padding: 0.3rem;
  padding-left: 1rem;
  padding-right: ${(props) => (!props.hasArrow ? "0.3rem" : "1rem")};
  max-width: 200px;
  height: 2rem;
  line-height: 1.5rem;

  display: inline-block;
  position: relative;

  background-color: ${(props) => (props.isSelected ? activeColor : "white")};

  ${clickableCss};

  ${(props) => {
    const isSelected = props.isSelected;

    return props.hasArrow === false
      ? css`
          :before {
            content: "";
            width: 0;
            height: 0;
            border-top: ${arrowSize} solid transparent;
            border-bottom: ${arrowSize} solid transparent;

            border-left: ${arrowSize} solid ${Colors.JUNGLE_MIST};

            position: absolute;

            right: ${arrowLeft};
            top: 0;
          }

          :after {
            content: "";
            width: 0;
            height: 0;
            border-top: ${arrowSize} solid transparent;
            border-bottom: ${arrowSize} solid transparent;

            border-left: ${arrowSize} solid #ffffff;
            border-left-color: ${() => (isSelected ? activeColor : "#ffffff")};

            position: absolute;

            right: calc(${arrowLeft} + 1px);
            top: 0;

            ${clickableCss};
          }
        `
      : ``;
  }};
}

  &:hover {
    background-color: ${hoverColor};
  }

  &:active {
    background-color: ${activeColor};
  }

  &:hover:after {
    border-left: ${arrowSize} solid ${hoverColor};
  }

  &:active:after {
    border-left: ${arrowSize} solid ${activeColor};
  }
`;

const Content = styled.div`
  display: flex;
  align-items: center;
`;

const Title = styled(OverflowingText)`
  flex: 1;
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  title: string;
  type: ContextDiffEntityTypeEnum | undefined;

  isSelected: boolean;
  hasArrow: boolean;

  onClick: () => void;

  className?: string;
}

//endregion [[ Props ]]

export const NavigationBarButton = (props: Props) => {
  return (
    <NavigationBarButtonView
      isSelected={props.isSelected}
      onClick={props.onClick}
      hasArrow={props.hasArrow}
      className={props.className}>
      <Content>
        <Title>{props.title}</Title>
      </Content>
    </NavigationBarButtonView>
  );
};
