import * as React from "react";
import styled from "styled-components";
import { loggerCreator } from "../../../../../utils/logger";
import { PropsWithChildren } from "react";
import { CommonColors } from "../../../../../styling/commonColors";

const moduleLogger = loggerCreator("__filename");

//region [[ Styles ]]

const SubTitle = styled.div`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${CommonColors.SHERPA_BLUE};
`;

export const Title = styled.div`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${CommonColors.SHERPA_BLUE};
`;
const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
  grid-gap: 0.5rem;
`;
export const MonetizationPanelHeaderView = styled.div`
  display: flex;
  grid-gap: 1rem;
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  title: string;
  subTitle?: string;
  className?: string;
}

//endregion [[ Props ]]

export const MonetizationPanelHeader = (props: PropsWithChildren<Props>) => {
  return (
    <MonetizationPanelHeaderView className={props.className}>
      <TitleSection>
        <Title>{props.title}</Title>
        <SubTitle>{props.subTitle}</SubTitle>
      </TitleSection>
      {props.children}
    </MonetizationPanelHeaderView>
  );
};
