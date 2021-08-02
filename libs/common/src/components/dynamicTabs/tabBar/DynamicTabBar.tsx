import * as React from "react";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { CommonColors } from "../../../styling/commonColors";
import { DynamicTabData } from "../DynamicTabs";
import { DynamicTabButton } from "./tabButton/DynamicTabButton";
import { Tooltip } from "../../Tooltip";

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
  align-items: flex-end;
`;

const IndicatorLine = styled(motion.div)<{ left: number; width: number; bottom: string }>`
  position: absolute;
  height: 3px;
  width: ${(props) => props.width}px;
  background-color: ${CommonColors.DAINTREE};
  bottom: ${(props) => props.bottom};
  left: ${(props) => props.left}px;
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props<T> {
  tabs: DynamicTabData<T>[];
  indicatorPlacement?: string;
  controlled?: {
    setCallback: (index: number) => void;
    currentIndex: number;
  };
  className?: string;
}

//endregion [[ Props ]]

export const DynamicTabBar = <T extends string>(props: Props<T>) => {
  const tabBarRef = useRef<HTMLDivElement | null>(null);
  const tabsRef = useRef(new Map<number, HTMLDivElement | null>());
  const [selectedTab, setSelectedTab] = useState({ tabIndex: -1, left: 0, width: 0 });

  useEffect(() => {
    if (props.controlled) {
      updateIndicatorPosition(props.controlled.currentIndex);
    }
  }, [props.controlled]);

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
  }, []);

  function onTabChange(tab: DynamicTabData<T>, index: number) {
    tab.onClick(tab.tabOption);

    if (props.controlled) {
      props.controlled.setCallback(index);
    } else {
      updateIndicatorPosition(index);
    }
  }

  return (
    <TabBarView className={props.className} ref={tabBarRef}>
      {props.tabs.map((tab, i) => (
        <Tooltip key={i} content={tab?.tooltip ?? ""} disabled={!tab?.tooltip} arrow={false} distance={0}>
          <DynamicTabButton
            ref={(el) => tabsRef.current.set(i, el)}
            key={i}
            onClick={() => onTabChange(tab, i)}
            isSelected={tab.isSelected}
            isDisabled={tab.isDisabled}>
            {tab.header ?? tab.tabOption}
          </DynamicTabButton>
        </Tooltip>
      ))}
      <IndicatorLine
        left={selectedTab.left}
        width={selectedTab.width}
        bottom={props.indicatorPlacement ?? "0"}
        layout
      />
    </TabBarView>
  );
};
