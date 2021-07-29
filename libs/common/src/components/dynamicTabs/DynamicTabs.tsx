import * as React from "react";
import styled from "styled-components";
import { loggerCreator } from "common/utils/logger";
import { DynamicTabBar } from "./tabBar/DynamicTabBar";
import { ReactElement, ReactNode } from "react";

// noinspection JSUnusedLocalSymbols
const moduleLogger = loggerCreator(__filename);

//region [[ Styles ]]

const DynamicTabsView = styled.div`
  display: flex;
  flex-direction: column;
`;

const TabBarStyled = styled(DynamicTabBar)`` as typeof DynamicTabBar;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface DynamicTabData<T> {
  tabOption: T;
  header?: ReactNode;
  isSelected: boolean;
  isDisabled?: boolean;
  tooltip?: ReactElement | string;
  onClick: (tab: T) => void;
}

export interface Props<T> {
  tabs: DynamicTabData<T>[];
  indicatorsPlacement?: string;
  horizontalPadding?: string;
  controlled?: {
    setCallback: (index: number) => void;
    currentIndex: number;
  };
  className?: string;
}

//endregion [[ Props ]]

export const DynamicTabs = <T extends string>(props: Props<T>) => {
  return (
    <DynamicTabsView className={props.className}>
      <TabBarStyled<T> tabs={props.tabs} indicatorPlacement={props.indicatorsPlacement} controlled={props.controlled} />
    </DynamicTabsView>
  );
};
