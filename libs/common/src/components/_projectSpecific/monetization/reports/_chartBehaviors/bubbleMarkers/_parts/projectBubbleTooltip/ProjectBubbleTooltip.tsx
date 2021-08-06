import * as React from "react";
import styled from "styled-components";
import { loggerCreator } from "../../../../../../../../utils/logger";
import { DateTime } from "luxon";
import { OverflowingText } from "../../../../../../../overflowingText/OverflowingText";
import { CommonColors } from "../../../../../../../../styling/commonColors";

// noinspection JSUnusedLocalSymbols
const moduleLogger = loggerCreator("__filename");

//region [[ Styles ]]

const Header = styled.span`
  font-size: 0.625rem;
  opacity: 0.5;
  font-weight: 600;
`;
const Title = styled(OverflowingText)`
  font-size: 0.75rem;
  font-weight: 600;
`;
const RowDiv = styled.div`
  display: grid;
  align-items: center;
  justify-items: start;
  grid-auto-flow: row;
  padding: 0.25rem;
  font-size: 0.75rem;
  width: 100%;
  text-align: start;
  grid-gap: 0.5rem;
  border-top: 1px solid ${CommonColors.SHMATTENS_BLUE};
`;

const ContentText = styled.span`
  font-size: 0.75rem;
  font-weight: 500;
`;

const ProjectBubbleTooltipView = styled.div`
  display: grid;
  grid-auto-flow: row;
  grid-auto-rows: auto;
  grid-gap: 0.5rem;
  padding: 0.5rem 1rem;
  align-items: center;
  justify-items: center;
`;

//endregion [[ Styles ]]

export interface Props {
  date: DateTime;
  title?: string;
  content: string | Array<{ label: string; text: string }>;
  className?: string;
}

export const ProjectBubbleTooltip = ({ date, title, content, ...props }: Props) => {
  return (
    <ProjectBubbleTooltipView className={props.className}>
      <Header>{date.toFormat("MMM dd yyyy")}</Header>
      {title && <Title>{title}</Title>}
      {typeof content === "string" ? (
        <ContentText>{content}</ContentText>
      ) : (
        <>
          <Title>{"Events"}</Title>
          {content.map(({ label, text }, i) => (
            <RowDiv key={i}>
              <Title>{label}</Title>
              <span>{text}</span>
            </RowDiv>
          ))}
        </>
      )}
    </ProjectBubbleTooltipView>
  );
};
