import * as React from "react";
import { PropsWithChildren } from "react";
import styled from "styled-components";

//region [[ Styles ]]

export const Title = styled.span`
  font-size: 0.8125rem;
  font-weight: 600;
  text-transform: uppercase;
`;

const TitledPanelView = styled.div<{}>`
  text-align: center;
  flex: 1 1 auto;
  padding: 0 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  title?: string;
  className?: string;
}

//endregion [[ Props ]]

export const TitledPanel = ({ children, title, ...props }: PropsWithChildren<Props>) => {
  return (
    <TitledPanelView className={props.className}>
      {title && <Title>{title}</Title>}
      {children}
    </TitledPanelView>
  );
};
