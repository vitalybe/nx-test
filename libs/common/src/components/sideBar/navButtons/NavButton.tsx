import * as React from "react";
import { FocusEventHandler, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { loggerCreator } from "../../../utils/logger";
import { CommonUrls, QueryParam } from "../../../utils/commonUrls";
import { combineUrl } from "../../../utils/combineUrl";
import { RouteMetadata } from "../../../stores/_models/routeMetadata";
import { SideBarStyles } from "../_styles/sideBarStyles";
import { SidebarButton } from "../sidebarButton/SidebarButton";
import { Utils } from "../../../utils/utils";

const moduleLogger = loggerCreator("__filename");

//region [[ Styles ]]

const MultiNavButtonsContainer = styled.div<{ height: string }>`
  overflow: hidden;
  transition: 0.4s ease;
  display: flex;
  flex-direction: column;
  height: ${(props) => props.height};
`;

//endregion [[ Styles ]]

export interface Props {
  route: RouteMetadata;
  backgroundColor?: string;
  selectedColor?: string;
  showTitle: boolean;
  isWide: boolean;
  path: string;
  isChild: boolean;
  focusHandler?: FocusEventHandler;
}

export const NavButton = ({ route, showTitle, isWide, path, ...props }: Props) => {
  const [isContainerExpanded, setIsContainerExpanded] = useState(false);
  const [containerHeight, setContainerHeight] = useState(SideBarStyles.NAV_BUTTON_HEIGHT);

  useEffect(() => {
    if (!isWide) {
      setIsContainerExpanded(false);
      setContainerHeight(SideBarStyles.NAV_BUTTON_HEIGHT);
    }
  }, [isWide]);

  const isNavButtonSelected = (route: RouteMetadata) => !!route.path && path.startsWith(route.path.toLowerCase());

  const containerRef = useRef<HTMLDivElement>(null);
  const handleElementFocus = (e: React.FocusEvent<HTMLImageElement>) => {
    if (!isWide) {
      e.stopPropagation();
    }
    containerRef.current?.scrollTo({ top: 0 });
  };

  if (route.children && route.children.length > 1) {
    const routeChildren = route.children;

    const isContainerSelected = routeChildren.some((routeChild) => isNavButtonSelected(routeChild));

    const onContainerClick = () => {
      const defaultHeight = parseInt(SideBarStyles.NAV_BUTTON_HEIGHT);
      const prevIsContainerExpanded = isContainerExpanded;
      setIsContainerExpanded(!prevIsContainerExpanded);
      setContainerHeight(
        (!prevIsContainerExpanded ? defaultHeight * (1 + routeChildren.length) : defaultHeight) + "px"
      );
    };

    return (
      <MultiNavButtonsContainer height={containerHeight} ref={containerRef}>
        <SidebarButton
          onClick={onContainerClick}
          shouldShowTitle={showTitle}
          isSelected={isContainerSelected}
          image={route.image ? CommonUrls.qcServicesUrl + route.image : undefined}
          label={route.label}
          isChild={false}
          childrenState={isContainerExpanded ? "expanded" : "collapsed"}
        />
        {routeChildren.map((routeChild) => {
          return (
            <NavButton
              key={routeChild.path}
              route={routeChild}
              showTitle={showTitle}
              isWide={isWide}
              path={path}
              isChild={true}
              focusHandler={handleElementFocus}
            />
          );
        })}
      </MultiNavButtonsContainer>
    );
  } else {
    let routeData = route;
    if (route.children?.length === 1) {
      const firstChild = route.children[0];
      routeData = {
        ...route,
        ...firstChild,
        label: firstChild.useGroupLabel ? route.label : firstChild.label,
      };
    }
    const isSelected = isNavButtonSelected(routeData);
    const projectPersistentParams: QueryParam[] = getProjectPersistentParams(routeData);

    const routeHref = CommonUrls.addPersistentQueryParams(
      combineUrl(location.origin, routeData.path ?? ""),
      projectPersistentParams
    );

    return (
      <SidebarButton
        onFocus={props.focusHandler}
        href={routeHref}
        isSelected={isSelected}
        label={routeData.label}
        image={routeData.image ? CommonUrls.qcServicesUrl + routeData.image : undefined}
        shouldShowTitle={showTitle}
        childrenState={"none"}
        isChild={props.isChild}
      />
    );
  }
};

//region [[ Utils ]]
function getProjectPersistentParams(routeData: RouteMetadata) {
  const urlSearchParams = new URLSearchParams(location.search);
  const projectPersistentParams: QueryParam[] =
    routeData.projectPersistentParams
      ?.map((projectPersistentParam) => {
        let queryParam: QueryParam | undefined;

        const urlParamValue = urlSearchParams.get(projectPersistentParam);
        if (urlParamValue) {
          queryParam = {
            name: projectPersistentParam,
            value: urlParamValue,
          };
        }

        return queryParam;
      })
      .filter(Utils.isTruthy) ?? [];
  return projectPersistentParams;
}
//endregion
