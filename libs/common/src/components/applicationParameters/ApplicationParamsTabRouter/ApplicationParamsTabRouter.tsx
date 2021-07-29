import * as React from "react";
import styled from "styled-components";
import { loggerCreator } from "common/utils/logger";
// @ts-ignore
import { ApplicationParamsTabBar } from "common/components/applicationParameters/ApplicationParamsTabRouter/tabBar/ApplicationParamsTabBar";

const moduleLogger = loggerCreator(__filename);

//region [[ Styles ]]

const QcTabRouterView = styled.div<{}>`
  display: flex;
  flex-direction: column;
`;

const TabBarStyled = styled(ApplicationParamsTabBar)<{ horizontalpadding: string }>`
  padding: 0 ${(props) => props.horizontalpadding};
`;

//endregion [[ Styles ]]

//region [[ Props ]]
export enum TabOptionEnum {
  FEATURE_FLAGS = "feature_flags",
  API_OVERRIDES = "api_overrides",
}

export interface TabData {
  tabOption: TabOptionEnum;
  isSelected: boolean;
  onClick: (tab: TabOptionEnum) => void;
}

export interface Props {
  tabs: TabData[];
  horizontalPadding?: string;

  className?: string;
}

//endregion [[ Props ]]
export const ApplicationParamsTabRouter = (props: Props) => {
  const horizontalPadding = props.horizontalPadding ?? "1rem";

  return (
    <QcTabRouterView className={props.className}>
      <TabBarStyled tabs={props.tabs} horizontalpadding={horizontalPadding} />
    </QcTabRouterView>
  );
};
