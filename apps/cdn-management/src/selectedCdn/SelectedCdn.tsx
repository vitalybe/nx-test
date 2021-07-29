import * as React from "react";
import { ReactNode } from "react";
import styled from "styled-components";
import { observer } from "mobx-react-lite";
import { TabData, TabRouter } from "@qwilt/common/components/tabRouter/TabRouter";
import { ProjectUrlStore } from "../_stores/projectUrlStore";
import { ProjectUrlParams } from "../_stores/projectUrlParams";
import { CacheGroupGridContainer } from "./tabs/tabCacheGroups/CacheGroupGridContainer";
import { CacheGroupGridTabSelector } from "./tabs/tabCacheGroups/CacheGroupGridTabSelector";
import { TabCachesTabSelector } from "./tabs/tabCaches/tabCachesTabSelector";
import { TabCachesContainer } from "./tabs/tabCaches/tabCachesContainer";
import { TabMonitorsAndRouters } from "./tabs/tabMonitorsAndRouters/TabMonitorsAndRouters";
import { TabMonitorsAndRoutersSelector } from "./tabs/tabMonitorsAndRouters/TabMonitorsAndRoutersSelector";
import { TabMonitorSegments } from "./tabs/tabMonitorSegments/TabMonitorSegments";
import { TabMonitorSegmentsTabSelector } from "./tabs/tabMonitorSegments/TabMonitorSegmentsTabSelector";
import { TabDnsSegmentsTabSelector } from "./tabs/tabDnsSegments/TabDnsSegmentsTabSelector";
import { TabDnsSegments } from "./tabs/tabDnsSegments/TabDnsSegments";
import { TabDsAssignmentContainer } from "./tabs/tabDsAssignment/TabDsAssignmentContainer";
import { Colors } from "../_styling/colors";
import { TabDsAssignmentTabSelector } from "./tabs/tabDsAssignment/TabDsAssignmentTabSelector";
import { TabStaticDnsContainer } from "./tabs/tabStaticDns/TabStaticDnsContainer";

const TabRouterStyled = styled(TabRouter)`
  flex: 1;
`;

export interface Props {
  className?: string;
}

export interface EntitySubtitle {
  amount: number;
  icon: ReactNode;
  tooltip?: string;
}

export const SelectedCdn = observer((props: Props) => {
  let tabs: TabData[] = [
    {
      path: "/cache-groups",
      title: <CacheGroupGridTabSelector />,
      component: <CacheGroupGridContainer />,
      default: true,
    },
    {
      path: "/caches",
      title: <TabCachesTabSelector />,
      component: <TabCachesContainer />,
    },
    {
      path: "/monitors-and-routers",
      title: <TabMonitorsAndRoutersSelector />,
      component: <TabMonitorsAndRouters />,
    },
    {
      path: "/monitoring-segments",
      title: <TabMonitorSegmentsTabSelector />,
      component: <TabMonitorSegments />,
    },
    {
      path: "/dns-routing-segments",
      title: <TabDnsSegmentsTabSelector />,
      component: <TabDnsSegments />,
    },
    {
      path: "/ds-assignments",
      title: <TabDsAssignmentTabSelector />,
      background: Colors.GROUP_2_COLOR,
      component: <TabDsAssignmentContainer />,
    },
    {
      path: "/static-dns",
      title: "Static DNS",
      background: Colors.GROUP_2_COLOR,
      component: <TabStaticDnsContainer />,
    },
  ];
  if (ProjectUrlStore.getInstance().getBooleanParam(ProjectUrlParams.tempFlag_tamarDemoOnlyDsAssignments)) {
    tabs = tabs.filter((tab) => tab.path === "/ds-assignments").map((tab) => ({ ...tab, default: true }));
  }

  return <TabRouterStyled onTabChange={onTabChange} tabs={tabs} />;
});

function onTabChange() {
  const builder = ProjectUrlStore.getInstance().getUrlStoreBuilder();
  builder.setParam(ProjectUrlParams.filter1, "");
  builder.setParam(ProjectUrlParams.filter2, "");
  ProjectUrlStore.getInstance().updateFromUrlStoreBuilder(builder);
}
