import styled from "styled-components";
import { MonetizationPanelHeader } from "common/components/_projectSpecific/monetization/reports/monetizationPanelHeader/MonetizationPanelHeader";

export const MiniChartPanelHeader = styled(MonetizationPanelHeader)`
  padding: 0;
`;

export const MiniChartView = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  grid-gap: 1rem;
  position: relative;
`;
