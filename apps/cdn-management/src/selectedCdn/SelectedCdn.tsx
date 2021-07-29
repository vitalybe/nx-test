import * as React from "react";
import { ReactNode } from "react";
import styled from "styled-components";
import { observer } from "mobx-react-lite";
import { TabData, TabRouter } from "common/components/tabRouter/TabRouter";
import { ProjectUrlStore } from "src/_stores/projectUrlStore";
import { ProjectUrlParams } from "src/_stores/projectUrlParams";
import { CacheGroupGridContainer } from "src/selectedCdn/tabs/tabCacheGroups/CacheGroupGridContainer";
import { CacheGroupGridTabSelector } from "src/selectedCdn/tabs/tabCacheGroups/CacheGroupGridTabSelector";
import { TabCachesTabSelector } from "src/selectedCdn/tabs/tabCaches/tabCachesTabSelector";
import { TabCachesContainer } from "src/selectedCdn/tabs/tabCaches/tabCachesContainer";
import { TabMonitorsAndRouters } from "src/selectedCdn/tabs/tabMonitorsAndRouters/TabMonitorsAndRouters";
import { TabMonitorsAndRoutersSelector } from "src/selectedCdn/tabs/tabMonitorsAndRouters/TabMonitorsAndRoutersSelector";
import { TabMonitorSegments } from "src/selectedCdn/tabs/tabMonitorSegments/TabMonitorSegments";
import { TabMonitorSegmentsTabSelector } from "src/selectedCdn/tabs/tabMonitorSegments/TabMonitorSegmentsTabSelector";
import { TabDnsSegmentsTabSelector } from "src/selectedCdn/tabs/tabDnsSegments/TabDnsSegmentsTabSelector";
import { TabDnsSegments } from "src/selectedCdn/tabs/tabDnsSegments/TabDnsSegments";
import { TabDsAssignmentContainer } from "src/selectedCdn/tabs/tabDsAssignment/TabDsAssignmentContainer";
import { Colors } from "src/_styling/colors";
import { TabDsAssignmentTabSelector } from "src/selectedCdn/tabs/tabDsAssignment/TabDsAssignmentTabSelector";
import { TabStaticDnsContainer } from "src/selectedCdn/tabs/tabStaticDns/TabStaticDnsContainer";

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
