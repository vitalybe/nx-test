import * as React from "react";
import { ReactNode } from "react";
import styled from "styled-components";
import { loggerCreator } from "../../utils/logger";
// @ts-ignore
import { RouteComponentProps, Router } from "@reach/router";
import { CommonUrls } from "../../utils/commonUrls";
import { TabRouterTab } from "./tabRouterTab/TabRouterTab";

const moduleLogger = loggerCreator("__filename");

//region [[ Styles ]]

const TabRouterView = styled.div<{}>`
  display: flex;
  flex-direction: column;
`;

export const TabBar = styled.div`
  display: grid;
  grid-auto-flow: column;
  font-size: 0.8em;
  column-gap: 0.5em;
  transform: translateY(1px);
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Title = styled.div``;

const TabInfo = styled.div`
  margin-top: 5px;
  width: 100%;
`;

const RouterStyled = styled(Router)`
  flex: 1;
  overflow: hidden;
`;

const TabContainerView = styled.div<RouteComponentProps & { backgroundColor: string }>`
  height: 100%;
  display: flex;
  flex-direction: column;

  background-color: ${(props) => props.backgroundColor};
  padding: 1em;
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface TabData {
  title: ReactNode;
  subtitle?: ReactNode;
  path: string;
  // NOTE: If not specified `path` is used. Only needed if `path` uses wildcards or another path detection that shouldn't be used for navigation
  navigationPath?: string;
  background?: string;
  component: ReactNode;
  default?: boolean;
}

export interface Props {
  tabs: TabData[];
  onTabChange?: () => void;

  className?: string;
}

//endregion [[ Props ]]

// NOTE: The router doesn't like when I nest children inside so the following are requirements:
// * TabContainer must be an external component (can't be nested inside <RouterStyled>
// * The children must be passed not as "children", so "content" was used.
const TabContainer = (props: { content: React.ReactNode; backgroundColor: string } & RouteComponentProps) => (
  <TabContainerView backgroundColor={props.backgroundColor}>{props.content}</TabContainerView>
);
export const TabRouter = (props: Props) => {
  return (
    <TabRouterView className={props.className}>
      <TabBar>
        {props.tabs.map((tab) => (
          <TabRouterTab
            background={getTabColor(tab)}
            key={tab.path}
            to={CommonUrls.buildUrl(tab.path, true)}
            navigationPath={tab.navigationPath ? CommonUrls.buildUrl(tab.navigationPath, true) : undefined}
            onNavigate={props.onTabChange}>
            <TitleContainer>
              <Title>{typeof tab.title === "string" ? tab.title.toUpperCase() : tab.title}</Title>
              {tab.subtitle && <TabInfo>{tab.subtitle}</TabInfo>}
            </TitleContainer>
          </TabRouterTab>
        ))}
      </TabBar>
      <RouterStyled basepath={CommonUrls.getProjectRoot(location.href)}>
        {props.tabs.map((tab) => (
          <TabContainer
            key={tab.path}
            path={tab.path}
            default={tab.default}
            backgroundColor={getTabColor(tab)}
            content={tab.component}
          />
        ))}
      </RouterStyled>
    </TabRouterView>
  );
};

function getTabColor(tab: TabData): string {
  return tab.background || "#b6dcf0";
}
