import * as React from "react";
import { useMemo } from "react";
import styled from "styled-components";
import { loggerCreator } from "common/utils/logger";
import { ChartSeriesData } from "common/components/qwiltChart/_domain/chartSeriesData";
import { MonetizationProjectEntity } from "common/components/_projectSpecific/monetization/_domain/monetizationProjectEntity";
import { OverallRevenueChart } from "common/components/_projectSpecific/monetization/reports/overallRevenueChart/OverallRevenueChart";
import { CommonColors } from "common/styling/commonColors";
import {
  MonetizationProviderUtils,
  ProjectEventData,
} from "common/components/_projectSpecific/monetization/_utils/monetizationProviderUtils/monetizationProviderUtils";

// noinspection JSUnusedLocalSymbols
const moduleLogger = loggerCreator(__filename);

//region [[ Styles ]]
const MultiProjectOverallRevenueTable = styled.div`
  display: grid;
  grid-template-columns: repeat(4, auto);
  font-size: 13px;
  color: ${CommonColors.SHERPA_BLUE};
  grid-auto-rows: 40px;
  margin: 12px 0 32px 0;
`;
const Header = styled.span`
  font-weight: 600;
  opacity: 0.6;
`;
const Cell = styled.span`
  font-weight: 500;
`;
const OverallRevenueChartStyled = styled(OverallRevenueChart)`
  height: 360px;
  margin-bottom: 48px;
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  seriesData: ChartSeriesData[];
  projects: MonetizationProjectEntity[];
  isps: { id: string; name?: string }[];
  className?: string;
}

//endregion [[ Props ]]

export const OverallRevenueChartPrint = ({ className, isps, projects, seriesData }: Props) => {
  const sortedEvents = useMemo<ProjectEventData[] | undefined>(() => {
    if (projects.length > 1) {
      return MonetizationProviderUtils.collectProjectEvents(projects, isps);
    }
  }, [projects, isps]);

  return (
    <>
      <OverallRevenueChartStyled
        isPrintMode
        seriesData={seriesData}
        selectedProjects={projects}
        className={className}
      />
      {sortedEvents && (
        <MultiProjectOverallRevenueTable>
          <Header>{"Date"}</Header>
          <Header>{"Service Provider"}</Header>
          <Header>{"Project"}</Header>
          <Header>{"Event Description"}</Header>
          {sortedEvents.map((event, i) => (
            <React.Fragment key={i}>
              <Cell key={`${i}-date`}>{event.date.toFormat("dd MMM yyyy")}</Cell>
              <Cell key={`${i}-spName`}>{event.spName}</Cell>
              <Cell key={`${i}-project`}>{event.project.name}</Cell>
              <Cell key={`${i}-description`}>{event.description}</Cell>
            </React.Fragment>
          ))}
        </MultiProjectOverallRevenueTable>
      )}
    </>
  );
};
