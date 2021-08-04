/* eslint-disable react-hooks/rules-of-hooks */
import * as React from "react";
import styled from "styled-components";
import { Props, SideBar } from "common/components/sideBar/SideBar";
import FixtureDecorator from "common/utils/cosmos/FixtureDecorator";
import { RouteMetadata } from "common/stores/_models/routeMetadata";

const View = styled(FixtureDecorator)`
  position: relative;
  border: 3px dashed lightgrey;

  width: 1000px;
  // without 'grid' the child item won't get the dimensions of the parent
  display: grid;
`;

const routeIcon = require("common/components/sideBar/_images/route-icon-example.svg");

function getProps(): Props {
  const firstRoutesGroup: RouteMetadata[] = [
    { capabilityId: "opsDashboard", path: "/", label: "OPS Dashboard", image: routeIcon },
    { capabilityId: "reports", path: "/reports", label: "Reports", image: routeIcon },
    { capabilityId: "cpDashboard", path: "/cp-dashboard", label: "Content Publisher Dashboard", image: routeIcon },
    {
      label: "Delivery Services",
      image: routeIcon,
      children: [
        {
          path: "/ds-dashboard-cp",
          label: "for Content Publishers",
          capabilityId: "dsDashboardCp",
          useGroupLabel: true,
        },
        {
          path: "/ds-dashboard-cp",
          label: "for Service Providers",
          capabilityId: "dsDashboardSp",
          useGroupLabel: true,
        },
      ],
    },
    { capabilityId: "marketplace", path: "/marketplace", label: "Marketplace", image: routeIcon },
  ];

  const secondRoutesGroup: RouteMetadata[] = [
    {
      capabilityId: "cdnManagement",
      path: "/cdn-manager",
      label: "External Products",
      image: routeIcon,
      children: firstRoutesGroup.filter(({ children }) => !children),
    },
    { capabilityId: "contentManagement", path: "/ds-manager", label: "CDN Management", image: routeIcon },
    { capabilityId: "snowball", path: "/snowball", label: "Snowball", image: routeIcon },
    {
      capabilityId: "contentPublishersManagement",
      path: "/content-publishers-management",
      label: "Content Publishers Management",
      image: routeIcon,
    },
    { capabilityId: "footprint", path: "/footprint", label: "Footprint", image: routeIcon },
  ];

  return {
    userName: "yuvalw@qwilt.com",
    routes: [firstRoutesGroup, secondRoutesGroup],
    projectParamsMetadata: undefined,
  };
}

export default {
  Regular: (
    <View>
      <SideBar {...getProps()} routes={[getProps().routes[0]]} />
    </View>
  ),
  "single child": (
    <View>
      <SideBar
        {...getProps()}
        routes={[
          [
            { ...getProps().routes[1][0], children: getProps().routes[1][0].children?.slice(0, 1) },
            { ...getProps().routes[0][3], children: getProps().routes[0][3].children?.slice(0, 1) },
          ],
        ]}
      />
    </View>
  ),
  "2nd group empty": (
    <View>
      <SideBar {...getProps()} routes={[getProps().routes[0], []]} />
    </View>
  ),
  "2 Groups": (
    <View>
      <SideBar {...getProps()} />
    </View>
  ),
  "3 Groups": (
    <View>
      <SideBar
        {...getProps()}
        routes={
          ([
            ...getProps().routes,
            [
              {
                capabilityId: "mockDashboard",
                path: "/mock-dashboard1",
                label: "Mock Dashboard",
                image: routeIcon,
              },
              {
                capabilityId: "mocksManagement",
                path: "/mocks-management1",
                label: "Mocks Management",
                image: routeIcon,
              },
            ],
          ] as unknown) as RouteMetadata[][]
        }
      />
    </View>
  ),
  "Too many": (
    <View>
      <SideBar
        {...getProps()}
        routes={
          ([
            ...getProps().routes,
            [
              {
                capabilityId: "mockDashboard",
                path: "/mock-dashboard2",
                label: "Mock Dashboard",
                image: routeIcon,
              },
              {
                capabilityId: "mocksManagement",
                path: "/mocks-management2",
                label: "Mocks Management",
                image: routeIcon,
              },
              {
                capabilityId: "mock",
                path: "/mock-dashboard3",
                label: "Mock Dashboard",
                image: routeIcon,
              },
              {
                capabilityId: "mocks",
                path: "/mocks-management3",
                label: "Mocks Management",
                image: routeIcon,
              },
              {
                capabilityId: "too many mocks",
                path: "/mock-dashboard4",
                label: "Mock Dashboard",
                image: routeIcon,
              },
              {
                capabilityId: "last mock",
                path: "/mocks-management4",
                label: "Mocks Management",
                image: routeIcon,
              },
            ],
            [
              {
                capabilityId: "mocks",
                path: "/mocks-management3",
                label: "Mocks Management",
                image: routeIcon,
              },
              {
                capabilityId: "too many mocks",
                path: "/mock-dashboard4",
                label: "Mock Dashboard",
                image: routeIcon,
              },
              {
                capabilityId: "last mock",
                path: "/mocks-management4",
                label: "Mocks Management",
                image: routeIcon,
              },
            ],
          ] as unknown) as RouteMetadata[][]
        }
      />
    </View>
  ),
};
