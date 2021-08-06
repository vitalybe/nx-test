import * as React from "react";
import { forwardRef, ReactNode } from "react";
import styled, { css } from "styled-components";
import { loggerCreator } from "../../../../../utils/logger";

const moduleLogger = loggerCreator("__filename");

//region [[ Styles ]]

const TabButtonView = styled.div<{ isSelected: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  min-height: 3rem;

  padding: 1.5rem 0;
  border-bottom: 0;
  border-radius: 10px 10px 0 0;
  text-transform: uppercase;
  transition: opacity 0.3s ease;

  font-weight: bold;

  ${(props) =>
    props.isSelected
      ? css`
          opacity: 1;
        `
      : css`
          cursor: pointer;
          opacity: 0.3;
          &:hover {
            opacity: 1;
          }
        `};
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
`;
//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  onClick: () => void;
  isSelected: boolean;

  children: ReactNode;

  className?: string;
}

//endregion [[ Props ]]

export const ApplicationParamsTabButton = forwardRef<HTMLDivElement, Props>((props: Props, ref) => {
  const onTabClick = async () => {
    props.onClick();
  };

  return (
    <TabButtonView ref={ref} isSelected={props.isSelected} onClick={!props.isSelected ? onTabClick : undefined}>
      <TitleContainer>{props.children}</TitleContainer>
    </TabButtonView>
  );
});
