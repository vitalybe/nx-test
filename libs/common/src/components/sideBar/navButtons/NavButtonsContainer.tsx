import * as React from "react";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { loggerCreator } from "../../../utils/logger";
import { RouteMetadata } from "../../../stores/_models/routeMetadata";
import { CommonColors } from "../../../styling/commonColors";
import { NavButton } from "./NavButton";

const moduleLogger = loggerCreator("__filename");

//region [[ Styles ]]

const NavButtonsView = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 0 auto;
  color: ${CommonColors.BRIGHT_TURQUOISE};
  margin-top: 32px;
  width: 100%;
`;

const RouteGroupSeparator = styled.div<{ isWide: boolean }>`
  transition: 0.2s ease;
  width: ${({ isWide }) => (isWide ? "176px" : "32px")};
  height: 1px;
  background-color: #01222f;
  margin: 20px 16px;
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  routes: RouteMetadata[][];
  isWide: boolean;
}

//endregion [[ Props ]]

export const NavButtonsContainer = ({ routes, isWide, ...props }: Props) => {
  const [currentLocationPath, setCurrentLocationPath] = useState(location.pathname.toString());

  //Listens to an event triggered when TabRouterTabView clicked
  useEffect(
    () =>
      window.addEventListener("pathChanged", () => {
        setCurrentLocationPath(location.pathname.toString());
      }),
    []
  );

  return (
    <NavButtonsView>
      {routes.map((routeGroup, groupIndex) => (
        <React.Fragment key={groupIndex}>
          {routeGroup.map((route) => {
            return (
              <NavButton
                key={route.path || route.children?.find(({ path }) => path)?.path}
                route={route}
                showTitle={isWide}
                isWide={isWide}
                path={currentLocationPath}
                isChild={false}
              />
            );
          })}
          {groupIndex < routes.length - 1 && routes[groupIndex + 1].length > 0 && (
            <RouteGroupSeparator isWide={isWide} />
          )}
        </React.Fragment>
      ))}
      <RouteGroupSeparator isWide={isWide} />
    </NavButtonsView>
  );
};
