import * as React from "react";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { TabData } from "../ApplicationParamsTabRouter";
import { ApplicationParamsTabButton } from "common/components/applicationParameters/ApplicationParamsTabRouter/tabBar/tabButton/ApplicationParamsTabButton";
import { CommonColors } from "common/styling/commonColors";
import _ from "lodash";

//region [[ Styles ]]

const TabBarView = styled.div`
  display: grid;
  grid-auto-flow: column;
  font-size: 0.75rem;
  column-gap: 1rem;
  transform: translateY(1px);
  justify-content: start;
  position: relative;
  background-color: white;
`;

const IndicatorLine = styled(motion.div)<{ left: number; width: number }>`
  position: absolute;
  height: 3px;
  width: ${(props) => props.width}px;
  background-color: ${CommonColors.DAINTREE}
  bottom: 0;
  left: ${(props) => props.left}px;
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  tabs: TabData[];

  className?: string;
}

//endregion [[ Props ]]

export const ApplicationParamsTabBar = (props: Props) => {
  const tabBarRef = useRef<HTMLDivElement | null>(null);
  const tabsRef = useRef(new Map<number, HTMLDivElement | null>());
  const [selectedTab, setSelectedTab] = useState({ tabIndex: -1, left: 0, width: 0 });

  function updateIndicatorPosition(matchingTabIndex: number = 0): void {
    const parentRect = tabBarRef.current?.getBoundingClientRect();
    const rect = tabsRef.current.get(matchingTabIndex)?.getBoundingClientRect();

    if (rect && parentRect) {
      const indicatorLeft = rect.left - parentRect.left;
      const indicatorWidth = rect.width;
      setSelectedTab({ tabIndex: matchingTabIndex, left: indicatorLeft, width: indicatorWidth });
    }
  }

  useEffect(() => {
    updateIndicatorPosition();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onTabChange(tab: TabData, index: number) {
    tab.onClick(tab.tabOption);
    updateIndicatorPosition(index);
  }

  return (
    <TabBarView className={props.className} ref={tabBarRef}>
      {props.tabs.map((tab, i) => (
        <ApplicationParamsTabButton
          ref={(el) => tabsRef.current.set(i, el)}
          key={i}
          onClick={() => onTabChange(tab, i)}
          isSelected={tab.isSelected}>
          {_.startCase(tab.tabOption)}
        </ApplicationParamsTabButton>
      ))}
      <IndicatorLine left={selectedTab.left} width={selectedTab.width} layout />
    </TabBarView>
  );
};
