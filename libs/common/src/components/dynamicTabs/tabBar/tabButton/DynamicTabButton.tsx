import * as React from "react";
import { forwardRef, ReactNode } from "react";
import styled, { css } from "styled-components";
import { loggerCreator } from "../../../../utils/logger";

const moduleLogger = loggerCreator("__filename");

//region [[ Styles ]]

const TabButtonView = styled.div<{ isSelected: boolean; isDisabled?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  min-height: 3rem;

  padding: 1.5rem 0;
  border-bottom: 0;
  border-radius: 10px 10px 0 0;
  transition: opacity 0.3s ease;

  font-weight: bold;

  ${(props) =>
    props.isSelected
      ? css`
          opacity: 1;
        `
      : css`
          cursor: ${props.isDisabled ? "default" : "pointer"};
          opacity: 0.3;
          &:hover {
            opacity: ${props.isDisabled ? 0.3 : 1};
          }
        `};
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  onClick: () => void;
  isSelected: boolean;
  isDisabled?: boolean;
  children: ReactNode;

  className?: string;
}

//endregion [[ Props ]]

export const DynamicTabButton = forwardRef<HTMLDivElement, Props>((props: Props, ref) => {
  const onTabClick = async () => {
    props.onClick();
  };

  return (
    <TabButtonView
      ref={ref}
      isSelected={props.isSelected}
      isDisabled={props.isDisabled}
      onClick={!(props.isSelected || props.isDisabled) ? onTabClick : undefined}>
      <TitleContainer>{props.children}</TitleContainer>
    </TabButtonView>
  );
});
