import * as React from "react";
import styled from "styled-components";
import { loggerCreator } from "../../../utils/logger";
import { ExperimentsBarStyles } from "../_styling/experimentsBarStyles";
import { CommonColors } from "../../../styling/commonColors";
import _ from "lodash";

const moduleLogger = loggerCreator("__filename");

//region [[ Styles ]]

const DescriptionPanelView = styled.div<{ isExpanded: boolean }>`
  max-height: ${({ isExpanded }) => (isExpanded ? "240px" : "0")};
  min-height: ${({ isExpanded }) => (isExpanded ? "150px" : "0")};
  opacity: 0.95;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
  background-color: #39a6cc;
  width: 100%;
  transition: 0.5s ease-in-out;
  overflow: hidden;
`;

const DescriptionContainer = styled.div`
  display: flex;
  padding: 16px 0 10px 32px;
  width: 100%;
  min-height: 150px;
  max-height: 200px;
`;

const SummaryContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 510px;
`;

const SupportedQnsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-right: 15px;
`;

const SupportedQnsList = styled.div`
  margin-top: 16px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  max-height: 150px;
  overflow-y: auto;
  overflow-x: auto;
  width: 100%;
`;

const QnName = styled.span`
  margin-bottom: 10px;
  color: ${ExperimentsBarStyles.TEXT_COLOR};
  font-size: 12px;
  width: fit-content;
  margin-right: 15px;
`;

const Title = styled.div`
  color: ${ExperimentsBarStyles.TEXT_COLOR};
  font-size: 14px;
  font-weight: 600;
`;

const Summary = styled.p`
  color: ${ExperimentsBarStyles.TEXT_COLOR};
  font-size: 12px;
`;

const PartsDivider = styled.div`
  max-height: 200px;
  border: solid 1px ${CommonColors.NAVY_2};
  opacity: 0.2;
  margin: 0 32px;
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  isExpanded: boolean;
  summary: string;
  totalQnsCount: number;
  selectedVersion: string;
  supportedQnsNames: string[];

  className?: string;
}

//endregion [[ Props ]]

export const DescriptionPanel = ({ selectedVersion, ...props }: Props) => {
  return (
    <DescriptionPanelView isExpanded={props.isExpanded} className={props.className}>
      <DescriptionContainer>
        <SummaryContainer>
          <Title>VERSION {selectedVersion} SUMMARY</Title>
          <Summary>{props.summary}</Summary>
        </SummaryContainer>
        <PartsDivider />
        <SupportedQnsContainer>
          <Title>
            Supported QNs {props.supportedQnsNames.length}/{props.totalQnsCount}
          </Title>
          <SupportedQnsList>
            {_.orderBy(props.supportedQnsNames).map((name, i) => (
              <QnName key={i}>{name}</QnName>
            ))}
          </SupportedQnsList>
        </SupportedQnsContainer>
      </DescriptionContainer>
    </DescriptionPanelView>
  );
};
