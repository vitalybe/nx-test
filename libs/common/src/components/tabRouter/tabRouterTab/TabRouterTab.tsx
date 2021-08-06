import * as React from "react";
import { ReactChild } from "react";
import styled, { css } from "styled-components";
import { loggerCreator } from "../../../utils/logger";
import { Match, navigate } from "@reach/router";
import {
  TabRouterTabStore,
  TabRouterTabStoreContextProvider,
} from "../_stores/tabRouterTabStore";

const moduleLogger = loggerCreator("__filename");

//region [[ Styles ]]

const TabRouterTabView = styled.div<{ isSelected: boolean; background: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  min-height: 3em;

  padding: 0.5em;
  border-bottom: 0;
  background-color: ${(props) => props.background};
  opacity: 0.3;
  border-radius: 10px 10px 0 0;
  transition: opacity 0.3s ease;

  font-weight: bold;

  ${(props) =>
    props.isSelected
      ? css`
          opacity: 1;
        `
      : css`
          cursor: pointer;
          &:hover {
            opacity: 1;
          }
        `};
`;

//endregion [[ Styles ]]

//region [[ Props ]]

export interface Props {
  to: string;
  children: ReactChild;
  background: string;
  navigationPath?: string;
  onNavigate?: () => void;

  className?: string;
}

//endregion [[ Props ]]

export const TabRouterTab = (props: Props) => {
  let pathWithoutQueryParams = props.to;
  const queryParamsIndex = pathWithoutQueryParams.indexOf("?");
  if (queryParamsIndex > -1) {
    pathWithoutQueryParams = props.to.slice(0, queryParamsIndex);
  }

  const onTabClick = async () => {
    // We can't just use `props.to` because it might not contain all the current query parameters
    const newTo = new URL(props.navigationPath ?? props.to, location.origin);
    newTo.search = location.search;
    await navigate(newTo.toString()).then(() => {
      props.onNavigate?.();
      dispatchEvent(new Event("pathChanged"));
    });
  };

  return (
    <Match path={pathWithoutQueryParams}>
      {({ match }) => {
        const isSelected = !!match;
        return (
          <TabRouterTabStoreContextProvider store={new TabRouterTabStore(isSelected)}>
            <TabRouterTabView
              background={props.background}
              isSelected={isSelected}
              onClick={!isSelected ? onTabClick : undefined}>
              <div>{props.children}</div>
            </TabRouterTabView>
          </TabRouterTabStoreContextProvider>
        );
      }}
    </Match>
  );
};
